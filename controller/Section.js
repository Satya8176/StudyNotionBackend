const mongoose=require('mongoose');
const Course=require('../models/Course')
const Section=require('../models/Section')


exports.createSection=async (req , res)=>{
  try{
    console.log(req.body);
    const {sectionName,courseId}=req.body;
    if(!sectionName || !courseId){
      return res.status(402).json({
        success:"False",
        message:"All properties are neccessary to filled out"
      })
    }
    const newsection=await Section.create({sectionName});
    const updatedCourse=await Course.findByIdAndUpdate(courseId,
      {
        $push:{
          courseContent:newsection._id
        }
      },
      {new:true}
    ) 
    // Now herre use the populate function to show all the detail in the course of section and subsection 
    res.status(200).json({
      success:"true",
      body:updatedCourse,
      message:"New section created Successfully"
    })

  }
  catch(err){
    res.status(500).json({
      success:"False",
      body:err.message,
      message:"Unable to create section Please try again later"
    })
  }
}

exports.updateSection = async (req,res)=>{
  try{
    const {newSectionName,sectionId}=req.body;
    if(!newSectionName || !sectionId){
      return res.status(402).json({
        success:"False",
        message:"All fields are required"
      })
    }
    const updatedSec=Section.findByIdAndUpdate(sectionId,
      {newSectionName},
      {new:true}
    )
    return res.status(200).json({
      success:"True",
      body:updatedSec,
      message:"Section updated successfully"
    })
  }
  catch (err){
    res.status(500).json({
      success:"False",
      body:err.message,
      message:"Unable to update section Please try again later"
    })
  }
}

exports.deleteSection = async (req,res)=>{
  try{
    const {sectionId,courseId}=req.body;
    if(!sectionId || !courseId){
      return res.status(404).json({
        success:false,
        message:"Data is insufficient "
      })
    }
    const response=await Section.findByIdAndDelete(sectionId);
    //TODO do we need to delete the object id from course

    //Yes we need to delete the section from the couse also and here is the logic to do so
    const sectionIdtoRemove=new mongoose.Types.ObjectId(sectionId);
    await Course.findByIdAndUpdate(
      {_id:courseId},
      {
        $pull:{
          courseContent:sectionIdtoRemove
        }
      },
      {new:true}
    )
    return res.status(200).json({
      success:true,
      message:"Section deleted successfully"
    })
  }
  catch(err){
    res.status(500).json({
      success:false,
      body:err.message,
      message:"Unable to delete section please try again later"
    })
  }
}


exports.fetchSubSection=async(req,res)=>{
  try{
    const {sectionId}=req.body;
    if(!sectionId){
      return res.status(402).json({
        success:false,
        body:"Section is not Found Try agian later"
      })
    }
    const result=await Section.findById(sectionId).populate({
                                                            path:"subsection"
                                                            })
    if(!result){
      return res.status(404).json({
        success:false,
        message:"NO data found during fetching with the section id"
      })
    }
    return res.status(200).json({
      success:true,
      body:result.subsection,
      message:"subsection fetched successfully"
    })

  }
  catch(err){
    res.status(500).json({
      success:false,
      body:err.message,
      message:"SubSection not fetched successfully "
    })
  }
}
