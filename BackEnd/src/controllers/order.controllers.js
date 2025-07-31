import { Cart } from "../models/orders.models.js";
import { Product, Order } from "../models/products.models.js";
import mongoose from "mongoose";

export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      customerNotes,
      tax = 0,
      shippingCost = 0,
      discount = 0,
    } = req.body;

    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product).session(session);

      if (!product) {
        throw new Error(`Product with ID ${item.product} not found`);
      }

      if (product.quantity < item.quantity) {
        throw new Error(
          `Insufficient stock for ${product.name}. Available: ${product.quantity}`
        );
      }

      // Update product quantity
      product.quantity -= item.quantity;
      await product.save({ session });

      // Calculate item total
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      processedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0] || "",
      });
    }

    const totalAmount = subtotal + tax + shippingCost - discount;

    // Create order
    const order = new Order({
      items: processedItems,
      subtotal,
      tax,
      shippingCost,
      discount,
      totalAmount,
      paymentMethod,
      shippingAddress,
      customerNotes,
    });

    await order.save({ session });

    // Clear cart after successful order (if needed)
    // await Cart.findOneAndDelete({}).session(session);

    await session.commitTransaction();

    // Populate product details for response
    await order.populate("items.product", "name images category");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate("items.product", "name images category")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single order
export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate(
      "items.product",
      "name images category rating"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get order by order number
export const getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const order = await Order.findOne({ orderNumber }).populate(
      "items.product",
      "name images category rating"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { cancelReason } = req.body;

    const order = await Order.findById(id).session(session);

    if (!order) {
      throw new Error("Order not found");
    }

    if (!["pending", "confirmed"].includes(order.status)) {
      throw new Error("Order cannot be cancelled at this stage");
    }

    // Restore product quantities
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { quantity: item.quantity } },
        { session }
      );
    }

    // Update order status
    order.status = "cancelled";
    order.cancelReason = cancelReason;
    order.cancelledAt = new Date();
    await order.save({ session });

    await session.commitTransaction();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};
