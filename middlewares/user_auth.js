import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

import { ApiError } from "../utils/ApiError.js";
import User from "../model/user_model.js";

const isAuthenticated = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      throw new ApiError(401, "UnAuthorized Request");
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
