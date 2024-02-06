import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/AsyncHandler.js";

import { ApiError } from "../utils/ApiError.js";
import User from "../model/user_model.js";

const isAuthenticated = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Denied Access ",
      });
    }
    const decodedToken = jwt.verify(token, process.env.ACCESSTOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Invalid Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid User Token");
  }
});

export default isAuthenticated;
