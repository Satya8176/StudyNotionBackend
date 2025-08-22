const RatingAndReview=require('../models/RatingAndReview')
const Course=require('../models/Course')
const mongoose=require('mongoose')

exports.createRating=async(req,res)=>{
  try{
    const userId=req.user.id;
    const {courseId,rating,review}=req.body;
    const CourseDetail=await Course.findById(courseId);
    if(! CourseDetail.studentEnrolled.includes(userId)){
      return res.status(400).json({
        success:false,
        message:"User is not enrolled in this course "
      })
    }
    const checkReview=await RatingAndReview.findOne({
      course:courseId,
      user:userId,
    })
    if(checkReview){
      return res.status(403).json({
        success:false,
        message:"You already reviewd this course!!"
      })
    }
    const newReview=await RatingAndReview.create({
      rating,
      review,
      course:courseId,
      user:userId
    })
    const updateCourse=await Course.findByIdAndUpdate(
      {_id:courseId},
      {
        $push:{
          ratingAndReview:newReview._id
        }
      },
      {new:true}
    )
    return res.status(200).json({
      success:true,
      message:"Review is gone successfull",
      body:updateCourse
    })
  }
  catch(err){
    console.error(err)
    res.status(500).json({
      success:false,
      message:err.message
    })
  }
}

exports.getAverageRating=async (req, res)=>{
  try{
    const courseId=req.body.courseId;
    const objCourseId=new mongoose.Types.ObjectId(courseId);
    const result=await RatingAndReview.aggregate([
      {$match:{
        course:objCourseId
      }},
      {$group:{
        _id:null,
        averageRating:{
          $avg:"$rating"
        }
      }}
    ])
    if(result){
      return res.status(200).json({
        success:true,
        message:"Rating calculated successfully",
        body:result[0].averageRating
      })
    }
    return res.status(400).json({
      success:false,
      message:"Something went wrong kindly try again later for average rating"
    })
  }
  catch(err){
    console.log(err);
    return res.status(500).json({
      success:false,
      message:err.message
    })
  }
}

exports.getAllRating=async (req, res)=>{
  try{
    const ratingReview=await RatingAndReview.find({})
                      .sort({rating:"desc"})
                      .populate({
                        path:"user",
                        select:"firstName lastName email image"
                      })
                      // .populate({
                      //   path:"course",
                      //   select:"courseName ratingAndReview"
                      // })
                      // .exec()
          res.status(200).json({
            success:true,
            message:"Ratinga and Review fetched successfully",
            data:ratingReview
          })
  }
  catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    })
  }
}

exports.getCourseRating=async (req, res)=>{
  try{
    const {courseId}=req.body;
    const ratingdata=await RatingAndReview.findOne({course:courseId})
                                          .sort({rating:"desc"})
                                          .populate({
                                            path:'User',
                                            select:"fristName lastName email image"
                                          })
    if(!ratingdata){
      return res.status(400).json({
        success:false,
        message:"No rating found please try again later"
      })
    }
    return res.status(200).json({
      success:true,
      data:ratingdata,
      message:"Data fetched successfully"
    })
  }
  catch(err){
    console.error(err)
    return res.status(500).json({
      success:false,
      message:"Something went wrong please fetch the detail after some times"
    })
  }
}