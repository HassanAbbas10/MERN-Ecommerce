import { Router } from "express";
import {
  getDashboardAnalytics,
  getSalesAnalytics,
} from "../controllers/dashboard.controllers.js";

const router = Router();

router.get("/analytics", getDashboardAnalytics);
router.get("/analytics/sales", getSalesAnalytics);

export default router;
