const User=require('../models/User')
const Course=require('../models/Course')
const Category=require('../models/Category')
const Section=require('../models/Section')
const SubSection=require('../models/Subsection')
const RatingAndReview=require('../models/RatingAndReview')
const mongoose=require('mongoose')
const uploadImageCloudinary=require('../utils/uploadImageCloudinary')


exports.createCourse= async(req , res)=>{
  try{
    const {courseName,courseDescription,whatYouWillLearn,price,category}=req.body;
    const thumbnail=req.files.thumbnailImg;
    if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail){
      return res.status(402).json({
        success:false,
        message:"All field are neccssary to filled"
      })
    }
    const categoryId =new mongoose.Types.ObjectId(category)
    const userID=req.user.id;
    const userDetail=await User.findById(userID);
    if(! userDetail){
      return res.status(402).json({
        success:false,
        message:"Instructor not found"
      })
    }

    
    if(! await Category.findById(category)){
      return res.status(403).json({
        success:false,
        message:"Particular tag not found check your tag again"
      })
    }
    

    const response=await uploadImageCloudinary(thumbnail,process.env.CLOUD_FOLDER,400,50);
    const thumbURl=response.secure_url;
    
    
    const newCourse=await Course.create({
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      thumbnail:thumbURl,
      category:categoryId,
      instructor:userDetail._id
    })

    await User.findByIdAndUpdate(
      {_id:userDetail._id},
      {
        $push:{
          courses:newCourse
        }
      },
      {new:true}
    )
    await Category.findByIdAndUpdate(
      {_id:categoryId},
      {
        $push:{
          course:newCourse._id
        }
      },
      {new:true}
    )
    
    return res.status(200).json({
      success:true,
      body:newCourse,
      message:"Course created Successfully"
    })


  }
  catch(err){
    return res.status(501).json({
      success:false,
      message:err.message
    })
  }
}


exports.showAllCourses=async (req,res)=>{
  try{
    const response=await Course.find({},
      {courseName:true,
        courseDescription:true,
        instructor:true,
        price:true,
        thumbnail:true,
        tags:true,

      }
    ).populate("instructor").exec()
    return res.status(200).json({
      success:true,
      body:response,
      message:"These are the courses available"
    })
  }
  catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    })
  }
}

exports.getCourseDetails=async(req,res)=>{
  try{
    const {courseId}=req.body;

    const courseDetail=await Course.find({_id:courseId})
                                    .populate({
                                      path:"instructor",
                                      select: "firstName lastName image email" ,
                                      populate:{
                                        path:"additionalDetal",
                                        select:"gender about contactNumber profession"
                                      }
                                    })
                                    .populate({
                                      path:"courseContent",
                                      populate:{
                                        path:"subsection"
                                      }
                                    })
                                    .populate({
                                      path:"category",
                                      select:"categoryName description course"
                                    })
                                    .populate(
                                      {
                                        path:"ratingAndReview"
                                      }
                                    )
                                    .select("courseDescription courseName thumbnail whatYouWillLearn"); 
    if(!courseDetail){
      return res.status(400).json({
        success:false,
        message:"Some thing went wrong while fetching the detail kindlt try again later"
      })
    }
    return res.status(200).json({
      success:true,
      message:"Course detail fetched successfully",
      body:courseDetail
    })
  }
  catch(err){
    // console.log(err);
    return res.status(500).json({
      success:false,
      message:err.message
    })
  }
}


// All section related to that course is fetched from here

exports.getAllSection=async(req,res)=>{
  try{
    const {courseId}=req.body;
    if(!courseId){
      return res.status(400).json({
        success:false,
        message:"There is no course for this Id"
      })
    }
    const courseDetail=await Course.findById(courseId).populate({
                                                      path:"courseContent",
                                                      populate:{
                                                        path:"subsection"
                                                      }
                                                    })
    if(!courseDetail){
      return res.status(402).json({
        success:false,
        message:"There is no course for this id "
      })
    }
    const allSection=courseDetail.courseContent;
    return res.status(200).json({
      success:true,
      data:allSection,
      message:"Section Fetched Successfully"
    })
  }
  catch(err){
    // console.log("There is some error in fetching all the section");
    return res.status(500).json({
      success:false,
      message:"There is some error in fetching the detail of the Sections"
    })
  }
}

exports.getDraftCourseDetail=async (req,res)=>{
  try{
    const {courseId}=req.body;
    if(!courseId){
      return res.json({
        success:false,
        message:"please send courseID"
      })
    }
    const courseDetail = await Course.find({_id:courseId})
                                    .populate({
                                      path:"courseContent",
                                      populate:{
                                        path:"subsection"
                                      }
                                    })
                                    .populate(
                                      {
                                        path:"ratingAndReview"
                                      }
                                   )
    if(!courseDetail){
      return res.json({
        success:false,
        message:"There is no course for this Id"
      })
    }
    return res.status(200).json({
      success:true,
      message:"Data fetched successfully",
      data:courseDetail
    })
  }
  catch(err){
    // console.log("There is some error in this drafted course detail");
    return res.status(502).json({
      success:false,
      message:"This is some Server issue"
    })
  }
}

exports.updateCourse=async(req,res)=>{
  try{
    const {courseId,courseName,courseDescription,whatYouWillLearn,price,category}=req.body;
    if(!courseId || !courseName || !courseDescription || !whatYouWillLearn || !price || !category){
      return res.status(402).josn({
        success:false,
        message:"Some data is missing kindly check it again"
      })
    }
    const response=await Course.findByIdAndUpdate(
      {_id:courseId},
      {
        courseName:courseName,
        courseDescription:courseDescription,
        whatYouWillLearn:whatYouWillLearn,
        price:price,
        category:category
      },
      {
        new:true
      }
    )
    return res.status(200).json({
      success:true,
      message:"Course is updated successfully"
    })
  }
  catch(err){

    return res.status(502).json({
      success:false,
      message:err.message
    })
  }
}

exports.updateDraftCourse=async(req,res)=>{
  try{
    const {courseId}=req.body;
    if(!courseId){
      return res.status(400).josn({
        success:false,
        message:"Course Id is not found please provide the id"
      })
    }
    await Course.findByIdAndUpdate(
      {_id:courseId},
      {
        isDraft:false
      },
      {new:true}
    )
    return res.status(200).json({
      success:true,
      message:"Course is published Successfully"
    })
  }
  catch(err){
    // console.error(err);
    return res.status(500).josn({
      success:false,
      message:err.message
    })
  }
}

exports.deleteCourse=async (req,res)=>{
  try{
    const {courseId}=req.body;
    if(!courseId){
      return res.status(400).json({
        success:false,
        message:"There is no course Id please provide course Id"
      })
    }
    const courseDetail=await Course.findById({_id:courseId})
    if(!courseDetail){
      return res.status(404).json({
        success:false,
        message:"Particular course is not found for this id"
      })
    }
    // console.log("Course Detail is ",courseDetail);
    // First we need to pull out this course from the all user which enrolled in it 
    for (const item of courseDetail.studentEnrolled){
      const userId=item;
      await User.findByIdAndUpdate(
        {_id:userId},
        {
          $pull:{
            courses:courseId
          }
        },
        {new:true}
      );
    }
    
    //Now we need to take care of the section and subsection values
    for(const item of courseDetail.courseContent){
      const sectionId=item;
      if(sectionId){
        const section = await Section.findById(sectionId);
        if (section?.subsection?.length > 0) {
          
          await SubSection.deleteMany({ _id: { $in: section.subsection } });
        }
        // await Section.findByIdAndDelete(sectionId);
        await Section.findOneAndDelete({_id:sectionId});
      }
    }
    
    //Now we need to take care of the ratinga and review
    for(const item of courseDetail.ratingAndReview){
      const ratingAndReview=item;
      if(ratingAndReview){
        await RatingAndReview.findByIdAndDelete(ratingAndReview); 
      }
    }
    //Now we need to take care of that this is course should be deleted from the courses of the instructor
    if(courseDetail.instructor){
      await User.findByIdAndUpdate(
        {_id:courseDetail.instructor},
        {
          $pull:{
            courses:courseDetail._id
          }
        },
        {new:true}
      )
    }
    //Now we need to take care that this course is not present in the category 
    await Category.findByIdAndUpdate(
      {_id:courseDetail.category},
      {
        $pull:{
          course:courseDetail._id
        }
      },
      {new:true}
    )
    await Course.findByIdAndDelete(courseDetail._id);
    return res.status(200).json({
      success:true,
      message:"Course deleted successfully"
    })

  }
  catch(err){
    return res.status(500).json({
      success:false,
      body:err.message,
      message:"Course not deletion not success"
    })
  }
}

//     courseName: string;
//     whatYouWillLearn: string;
//     courseContent: Types.ObjectId[];
//     ratingAndReview: Types.ObjectId[];
//     price: string;
//     thumbnail: string;
//     tags: Types.ObjectId[];
//     studentEnrolled: Types.ObjectId[];
//     instructor?: Types.ObjectId 