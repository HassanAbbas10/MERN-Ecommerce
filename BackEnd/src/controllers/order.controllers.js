import mongoose from "mongoose";
import { Orders, Cart } from "../models/orders.models.js";
import { Product } from "../models/products.models.js";
export const createOrders = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
  } catch (error) {}
};
