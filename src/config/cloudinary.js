import cloudinary from "cloudinary";

cloudinary.v2.config({
    cloud_name: "dcb4jhcdm",
    api_key: "137155443955461",
    api_secret: "MWarHNyeaH1ewyUawgO8UAqeqls",
    secure: true,
  });

export const UploadImageToCloud = async (files, type) => {
  try {
    const base64 = files.toString("base64");
    const imagePath = `data:${type};base64,${base64}`;
    const url = await cloudinary.v2.uploader.upload(imagePath, {
      folder: "assets_fullstackmobile2",
      //public_id: "IMG_" + Date.now(),
      resource_type: "auto",
    });
    return url.url;
  } catch (error) {
    console.log(error);
    return "";
  }
};
