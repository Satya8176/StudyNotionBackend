const cloudinary=require('cloudinary').v2;

const uploadImageCloudinary=async (file , folder , height , quality )=>{
  // console.log(file);
  const options={folder};
  if(height){
    options.height=height;
  }
  if(quality){
    options.quality=quality;
  }
  const isVideo = file.mimetype.startsWith("video/");
  // console.log("Uploading to Cloudinary...");
  if(isVideo){
    // options.resource_type="video";
    options.resource_type="auto";
    console.log("Uploaing videos ..")
    console.log("Options are here ",options);
    // return await cloudinary.uploader.upload(file.tempFilePath,options);
    const response=await cloudinary.uploader.upload(file.tempFilePath,options);
    return response;
  }
  else{
    options.resource_type="auto";
    console.log("Uploading images...")
    return await cloudinary.uploader.upload(file.tempFilePath, options);
  }
}

module.exports=uploadImageCloudinary;