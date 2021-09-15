import cloudinary from "cloudinary";
require("dotenv").config();

export function CloudinaryConfig() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}


