import mongoose from "mongoose";

export const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    images:[{
      type: String,
      required: true,
    }],
    description: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ["shirts", "electronics", "dairy"],
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("status").get(function () {
  if (this.quantity === 0) return "Out of Stock";
  if (this.quantity < 10) return "Low in Stock";
  return "In Stock";
});

export const Product = mongoose.model("Product", productSchema);
