import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderByNumber,
  cancelOrder,
  getOrder,
} from "../controllers/order.controllers.js";
const router = Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrder);
router.get("/track/:orderNumber", getOrderByNumber);
router.put("/cancel/:id", cancelOrder);

export default router;
