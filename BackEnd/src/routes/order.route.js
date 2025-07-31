import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getAllOrders,
  getOrderByNumber,
  cancelOrder,
  getOrder,
} from "../controllers/order.controllers";
const router = Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrder);
router.get("/track/:orderNumber", getOrderByNumber);
router.put("/cancel/:id", cancelOrder);

export default router;
