import mongoose from "mongoose";

export const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 1,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [orderItemSchema],

    subTotal: {
      type: Number,
      required: true,
    },

    tax: {
      type: Number,
      default: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      lowercase: true,
    },

    shippingAddress: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },
      street: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
      zipCode: {
        type: Number,
        required: true,
      },
      country: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
      },

      trackingNumber: {
        type: String,
        trim: true,
      },
      estimatedDelivery: {
        type: Date,
      },
      deliveredAt: {
        type: Date,
      },

      customerNotes: {
        type: String,
        trim: true,
      },
      adminNotes: {
        type: String,
        trim: true,
      },

      cancelReason: {
        type: String,
        trim: true,
      },
      cancelledAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
  }
);




orderSchema.virtual("totalItems").get(function(){
    return this.items.reduce((total, item) => total + item.quantity, 0)
})

orderSchema.virtual("orderAge").get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });

export const Order = mongoose.model("Order", orderSchema);

export const cartSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      }
    ],
    expiresAt: {
      type: Date,
      default: Date.now,
      expires: 7 * 24 * 60 * 60, // 7 days
    },
  },
  {
    timestamps: true,
  }
);

export const Cart = mongoose.model("Cart", cartSchema);