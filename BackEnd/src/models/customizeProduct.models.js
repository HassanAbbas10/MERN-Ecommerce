import mongoose from "mongoose";

const customizeProductSchema = new mongoose.Schema(
  {
    baseShirtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customLogo: {
      type: String, // base64 string or uploaded image URL
      required: true,
    },
    position: {
      x: {
        type: Number,
        required: true,
        default: 0,
      },
      y: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    size: {
      width: {
        type: Number,
        required: true,
        default: 100,
      },
      height: {
        type: Number,
        required: true,
        default: 100,
      },
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    customizationName: {
      type: String,
      default: "Custom Design",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
customizeProductSchema.index({ userId: 1 });
customizeProductSchema.index({ baseShirtId: 1 });

export const CustomizeProduct = mongoose.model("CustomizeProduct", customizeProductSchema);
