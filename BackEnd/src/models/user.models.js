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
      unique: true,
      trim: true,
      index: true,
      lowecase: true,
    },
    avatar: {
      type: String, //cloudinary url
      required: true,
    },
    coverImage: {
      type: String, //cloudinary url
      required: true,
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
  },
  { timestamps: true }
);

userSchema.pre("save",async function (next) {
   if(!this.isModified("password")) return next();
   this.password = bcrypt.hash(this.password,10);
   next();
})

userSchema.methods.isPasswordCorrect = async function (password){
  return await bcrypt.compare(password, this.password);
}

userSchema.methods.AccessToken = async() => {
   return jwt.sign(
    {
      _id:this._id,
      password:this.password,
      username:this.username,
      fullName:this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

userSchema.methods.RefreshToken = async () =>{
   return jwt.sign(
    {
      _id:this._id,
   
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
   )
}

export const User = mongoose.model("User", userSchema);
