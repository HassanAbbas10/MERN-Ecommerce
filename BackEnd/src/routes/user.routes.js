import Router from "express";
import userRegister from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router
  .route("/register")
  .post(
    upload.fields([{ name: "avatar" }, { name: "coverImage" }]),
    userRegister
  );

export default router;
