import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
export const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudinary url
      required: false,
    },
    coverImage: {
      type: String, //cloudinary url
      required: false,
    },
    watchHistory: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Video",
      },
    ],
    password: {
        type:String,
        required:[true,"Password is required"],
        
    },
    refreshToken: {
        type: String
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
   if(!this.isModified("password")) return next();
   this.password = await bcrypt.hash(this.password, 10);
   next();
})

userSchema.methods.isPasswordCorrect = async function (password){
  return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
   return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

userSchema.methods.generateRefreshToken = function(){
   return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
   )
}

export const User = mongoose.model("User", userSchema);
