const cloudinary=require('cloudinary').v2;

const uploadImageCloudinary=async (file , folder , height , quality )=>{
  const options={folder};
  if(height){
    options.height=height;
  }
  if(quality){
    options.quality=quality;
  }
  const isVideo = file.mimetype.startsWith("video/");
  if(isVideo){
    options.resource_type="auto";
    const response=await cloudinary.uploader.upload(file.tempFilePath,options);
    return response;
  }
  else{
    options.resource_type="auto";
    return await cloudinary.uploader.upload(file.tempFilePath, options);
  }
}

module.exports=uploadImageCloudinary;