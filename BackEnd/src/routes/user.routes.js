import Router from "express";
import { userRegister, userLogin, userLogout, getCurrentUser, getAllCustomers, getCustomerAnalytics } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/register")
  .post(
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    userRegister
  );

router.route("/login").post(userLogin);

// Secured routes
router.route("/logout").post(verifyJWT, userLogout);
router.route("/current-user").get(verifyJWT, getCurrentUser);

// Admin customer routes
router.route("/customers").get(verifyJWT, getAllCustomers);
router.route("/customers/analytics").get(verifyJWT, getCustomerAnalytics);

export default router;
