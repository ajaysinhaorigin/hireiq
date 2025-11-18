import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { config } from 'dotenv';
config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getPublicId = (url) => {
  // Example:
  // https://res.cloudinary.com/.../v12345/abcdefg.png
  const parts = url.split('/');
  const fileName = parts[parts.length - 1]; // "abcdefg.png"
  return fileName.split('.')[0]; // "abcdefg"
};

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });
    // file has been uploaded successfull
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log('error at cloudinaryupload function', error);
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

const deleteFromCloudinary = async (publicURL) => {
  try {
    const publicId = getPublicId(publicURL);
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.log('error at cloudinarydelete function', error);
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
