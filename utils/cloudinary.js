import { v2 as cloudinary } from "cloudinary";

import fs from "fs";

cloudinary.config({
  cloud_name: "ds4z1p9c8", // replace  with your cloudinary  cloud name
  api_key: "699777772934381", // replace with your cloudinary API key
  api_secret: "Ey9rv2Re9rvpU7QRq_Q4235df7I", // replace with your cloudinary API Secret
});

export const uploadOnCloudinary = async (localpath) => {
  try {
    console.log("localpath", localpath);
    if (!localpath) return null;
    const responce = await cloudinary.uploader.upload(localpath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localpath);
    // console.log("response", responce); for debugging purpose
    return responce;
  } catch (error) {
    console.log("error is encountered ", error.message);
    fs.unlinkSync(localpath);
    return null;
  }
};


