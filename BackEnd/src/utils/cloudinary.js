import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import { ApiError } from "./apiError.js";
import dotenv from "dotenv"
dotenv.config({
  path:"/.env"
})

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});
console.log(
  process.env.CLOUDINARY_NAME,
  process.env.CLOUDINARY_API_KEY,
  process.env.CLOUDINARY_SECRET_KEY,
  process.env.PORT 

)

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        console.log("File Uploaded Successfully on Cloudinary ", response.url);
        console.log(localFilePath)
        fs.unlinkSync(localFilePath);
        console.log(response);
        
        return response;
    } catch (error) {
  console.error("Cloudinary upload error:", error);
  fs.unlinkSync(localFilePath);
  throw new ApiError(500, "Cloudinary upload failed");
}
}

// const removeFromCloudinary = async (url) => {

//     const urlParts = url.split('/');
//     const removeFileExtension = urlParts.pop().split('.')[0];

//     await cloudinary.uploader.destroy(removeFileExtension, (error, result)=>{
//         if(error){
//             throw new ApiError(500, "Something Went wrong while deleting old file")
//         }else{
//             return result
//         }
//     })

// }

export { 
    uploadOnCloudinary,
    // removeFromCloudinary
 }