import express from "express";
import { upload } from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/user_auth.js";
import {
  DeleteUserProfile,
  LoginUser,
  LogoutUser,
  RegisterUser,
  UpdateRefreshAccessToken,
  UpdateUserDetails,
  UserProfile,
} from "../controllers/user_controller.js";

const router = express.Router();

router.route("/register").post(upload.single("profileImage"), RegisterUser);
router.route("/login").post(LoginUser);
router.route("/logout").get(isAuthenticated, LogoutUser);
router.route("/userprofile").get(isAuthenticated, UserProfile);
router
  .route("/updateuser")
  .put(isAuthenticated, upload.single("profileImage"), UpdateUserDetails);

router.route("/delete-profile").delete(isAuthenticated, DeleteUserProfile);
router.route("/refresh-token").post(UpdateRefreshAccessToken);

export default router;
