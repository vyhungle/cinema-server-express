import cloudinary from "cloudinary";
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const addImage = async (folder, image) => {
  const result = await cloudinary.v2.uploader.upload(image, {
    allowed_formats: ["jpg", "png"],
    public_id: "",
    folder,
  });
  console.log(result)
  return result.url;
};
