import { Router } from "express";
import {
  getAdminOrders,
  getOrderStats,
  updatePaymentStatus,
  updateOrderStatus,
} from "../controllers/adminOrder.controllers";

const router = Router();

router.get("/admin/all", getAdminOrders);
router.get("/admin/stats", getOrderStats);
router.put("/admin/status/:id", updateOrderStatus);
router.put("/admin/payment/:id", updatePaymentStatus);

export default router;
