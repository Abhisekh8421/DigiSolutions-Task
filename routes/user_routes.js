import express from "express";
import { upload } from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/user_auth.js";
import {
  LoginUser,
  LogoutUser,
  RegisterUser,
} from "../controllers/user_controller.js";

const router = express.Router();

router.route("/register").post(upload.single("profileImage"), RegisterUser);
router.route("/login").post(LoginUser);
router.route("/logout").get(isAuthenticated, LogoutUser);

export default router;
