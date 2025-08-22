const Subsection=require('../models/Subsection')
const Section=require('../models/Section');
const uploadImageCloudinary = require('../utils/uploadImageCloudinary');
const mongoose=require('mongoose');
require('dotenv').config()


exports.createSubSection=async(req,res)=>{
  try{
    const {sectionId,title,timeDuration=10,description}=req.body;
    const videoFile=req.files.videoFile;
    if(!sectionId || !title || !description || !videoFile){
      return res.status(402).json({
        success:false,
        message:"All fields are required"
      })
    }
    const videoDetail=await uploadImageCloudinary(videoFile,process.env.CLOUD_FOLDER);
    const newSubsection=await Subsection.create({
      title,
      timeDuration,
      description,
      videoUrl:videoDetail.secure_url
    })
    const updatedSection=await Section.findByIdAndUpdate({_id:sectionId},
      {
        $push:{
          subsection:newSubsection
        }
      },
      {new:true}
    )
    return res.status(200).json({
      success:true,
      body:updatedSection,
      message:"New subsection created successfully"
    })
  }
  catch(err){
    return res.status(500).json({
      success:false,
      body:err.message,
      message:"Unable to create subsection please try again later"
    })
  }
}

exports.updateSubSection=async (req, res)=>{
  try{
    const {subsectionId,title="",timeDuration="",description=""}=req.body;
    if(!subsectionId){
      return res.status(400).json({
        success:false,
        message:"Please provide the particular subsection id to update"
      })
    }
    const subsectionDetail=await Subsection.findById(subsectionId);
    if(title !== ""){
      subsectionDetail.title=title;
    }
    if(timeDuration !== ""){
      subsectionDetail.timeDuration=timeDuration;
    }
    if(description !== ""){
      subsectionDetail.description=description;
    }
    await subsectionDetail.save();
    res.status(200).json({
      success:true,
      messsage:"Subsection updated successfully"
    })

  }
  catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    })
  }
}

exports.deletesubsection=async (req, res)=>{
  try{
    const {sectionId,subsectionId}=req.body;
    if(!sectionId || !subsectionId){
      return res.status({
        success:false,
        message:"Kindly give the subsection id"
      })
    }
    
    if(!await Subsection.findById(subsectionId) || !await Section.findById(sectionId)){
      return res.status(400).json({
        success:false,
        message:"SubSection or Section entry not found"
      })
    }
    await Subsection.findByIdAndDelete(subsectionId);
    
    const subSectionIdtoRemove=new mongoose.Types.ObjectId(subsectionId);
    await Section.findByIdAndUpdate(
      {_id:sectionId},
      {
        $pull:{
          subsection:subSectionIdtoRemove
        }
      },
      {new:true}
    )
    res.status(200).json({
      success:true,
      message:"Subsection deleted successfully"
    })

  }
  catch(err){
    res.status(500).json({
      success:false,
      body:err.message,
      message:"Something went wrong in deleting the section kindly try after sometime"
    })
  }
}

exports.getSubSectionDetail=async (req,res)=>{
  try{
    const {subsectionId}=req.body;
    if(!subsectionId){
      return res.status(402).json({
        success:false,
        message:"Subsection id is required"
      })
    }
    const result=await Subsection.findById(subsectionId);
    if(!result){
      return res.status(404).json({
        success:false,
        message:"Lecture with this id is not found"
      })
    }
    return res.status(200).json({
      success:true,
      body:result,
      message:"Subsection detail found "
    })
  }
  catch(err){
    return res.status(500).json({
      success:false,
      body:err.message,
      message:"Lecture detail not fetched "
    })
  }
}

