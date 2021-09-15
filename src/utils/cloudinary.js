import { CloudinaryConfig } from "../config/cloudinary";

CloudinaryConfig();

export const addImage = async (folder, image) => {
  const result = await cloudinary.v2.uploader.upload(image, {
    allowed_formats: ["jpg", "png"],
    public_id: "",
    folder,
  });
  return result.url;
};
