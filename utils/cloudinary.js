import { v2 as cloudinary } from "cloudinary";

import fs from "fs";

cloudinary.config({
  cloud_name: "ds4z1p9c8", // replace  with your cloudinary  cloud name
  api_key: "699777772934381", // replace with your cloudinary API key
  api_secret: "Ey9rv2Re9rvpU7QRq_Q4235df7I", // replace with your cloudinary API Secret
});

// export const uploadOnCloudinary = async (localpath) => {
//   try {
//     if (!localpath) throw new Error("Local path is missing");
//     const response = await cloudinary.uploader.upload_stream(localpath, {
//       resource_type: "auto",
//     });
//     fs.unlinkSync(localpath);
//     return response;
//   } catch (error) {
//     console.error("Error uploading to Cloudinary:", error.message);
//     fs.unlinkSync(localpath);
//     throw new Error("Error uploading to Cloudinary");
//   }
// };

export const uploadOnCloudinary = async (fileBuffer) => {
  try {
    if (!fileBuffer) throw new Error("File buffer is missing");

    const response = await cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Error uploading to Cloudinary:", error.message);
            throw new Error("Error uploading to Cloudinary");
          }
          console.log("Cloudinary Response:", result);
          return result;
        }
      )
      .end(fileBuffer);

    return response;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);
    throw error;
  }
};
