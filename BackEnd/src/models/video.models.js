import mongoose from "mongoose";

export const videoSchema = new mongoose.Schema(
  {
    videoFile: {
      type: String, //Cloudinary
      required: true,
    },
    thumbnail: {
      type: String, //cloudinary
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    isPublished: {
      type: Boolean,
      required: true,
    },
    owner:[
        {
            type:mongoose.Types.ObjectId,
            ref:"User"
        }
    ]
  },
  { timestamps: true }
);

export const Video = mongoose.model("Video", videoSchema);
