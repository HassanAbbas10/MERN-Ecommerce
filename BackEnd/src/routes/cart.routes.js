import { Router } from "express";
import {
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCart,
} from "../controllers/cart.controllers.js";

const router = Router();
router.post("/cart/add", addToCart);
router.get("/cart", getCart);
router.put("/cart/item/:productId", updateCartItem);
router.delete("/cart/item/:productId", removeFromCart);
router.delete("/cart/clear", clearCart);

export default router;
