import { Router } from "express";
import {
  createCustomProduct,
  getUserCustomProducts,
  getCustomProductById,
  updateCustomProduct,
  deleteCustomProduct,
  getCustomizableShirts,
} from "../controllers/customize.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.route("/shirts").get(getCustomizableShirts);

// Protected routes (require authentication)
router.route("/").post(verifyJWT, createCustomProduct);
router.route("/user/:userId").get(verifyJWT, getUserCustomProducts);
router.route("/:customProductId").get(verifyJWT, getCustomProductById);
router.route("/:customProductId").put(verifyJWT, updateCustomProduct);
router.route("/:customProductId").delete(verifyJWT, deleteCustomProduct);

export default router;
