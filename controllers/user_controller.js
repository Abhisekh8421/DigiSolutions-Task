import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../model/user_model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const generateAccessandRefreshToken = async (userid) => {
  try {
    const user = await User.findById(userid);
    if (!user) {
      throw new ApiError(404, "User Does Not Exist");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "something went wrong");
  }
};

export const RegisterUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, role, password } = req.body;

    if ([username, email, password].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All Fields are required");
    }

    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists",
      });
    }

    console.log(req.file);
    const UserAvatarLocalPath = req.file?.path;

    if (!UserAvatarLocalPath) {
      throw new ApiError(400, "Avatar local path is required");
    }

    console.log("UserAvatarLocalPath:", UserAvatarLocalPath);

    const avatar = await uploadOnCloudinary(UserAvatarLocalPath);

    console.log("Cloudinary Response:", avatar);

    if (!avatar) {
      throw new ApiError(400, "Error uploading avatar to Cloudinary");
    }

    const user = await User.create({
      username,
      profileImage: avatar?.url,
      email,
      password,
      role,
    });

    // const createdUser = await User.findById(user._id).select(
    //   "-password -refreshToken"
    // );

    // if (!createdUser) {
    //   throw new ApiError(500, "Something went wrong while registration");
    // }

    return res
      .status(201)
      .json(new ApiResponse(201, user, "User Registered Successfully"));
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
});

export const LoginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(400, "email is required!!!");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User Doesnot Exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Password");
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    user._id
  );

  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedUser,
          accessToken,
          refreshToken,
        },
        "user is successfully logged in"
      )
    );
});

export const LogoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .status(200)
    .json(new ApiResponse(200, {}, "user logged out"));
});

export const UserProfile = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        message: `your profile is found: ${req.user.username}`,
        user: req.user,
      },
      "successfully fetched your profile"
    )
  );
});
