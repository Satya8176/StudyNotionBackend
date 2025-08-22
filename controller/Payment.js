const User=require('../models/User')
const Course=require('../models/Course')
const razorpay=require('../config/razorpay');
const mongoose = require('mongoose');
const sendEmail=require('../utils/sendEmail')
const crypto = require("crypto");
require('dotenv').config();

exports.capturePayment=async(req , res)=>{
  try{
    const {courseId}=req.body;
    const userId=req.user.id;
    if(!userId){
      return res.status(400).json({
        success:false,
        message:"There is an error Please login again to buy the course"
      })
    }
    if(!courseId){
      return res.status(400).json({
        success:false,
        message:"There is no course found please check your course again"
      })
    }
    //Now inorder to check that whether the user is already enrolled in particular course we have to check so we first convert the string to object id type
    const uid=new mongoose.Types.ObjectId(userId);
    const courseDetail=await Course.findById(courseId);
    if(courseDetail.studentEnrolled.includes(uid)){
      return res.status(400).json({
        success:false,
        message:"Student is already Enrolled"
      })
    }
    try{
      const option={
        "amount":courseDetail.price*100,
        "receipt":Math.random(Date.now()).toString(),
        "currency":"INR",
        "notes": {
          "userId":userId,
          "courseId":courseId
        },
      }
      try{
        const razorpayRes=await razorpay.orders.create(option);
        return res.status(200).json({
          success:true,
         // cousreDetail:courseDetail,
          key:process.env.RAZORPAY_KEY_ID,
          price:courseDetail.price*100,
          orderId:razorpayRes.id,
          message:"Ordered is placed "
        })
      }
      catch(err){
        return res.status(400).json({
          success:false,
          body:err.message,
          message:"Error in Iniatting payment"
        })
      }
    }
    catch(err){
      return res.status(400).json({
        success:false,
        message:"There is an error in Initiating the payment please try again later"
      })
    }
  }
  catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    })
  }
}

exports.verifySignature=async(req, res)=>{
  try{
    const webHookSecret="12345678";//this is from the server we have 
    const signature=req.headers["x-razorpay-signature"];//this is the secret from the razorpay 
    const shasum=crypto.createHmac("sha256",webHookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest=shasum.digest("hex");
    if(digest.trim() === signature.trim()){
      const { courseId, userId } = req.body.payload.payment.entity.notes;
      const updateCourse=await Course.findByIdAndUpdate({_id:courseId},
        {
          $push:{
            studentEnrolled:userId
          }
        },
        {new:true}
      )
      const updateUser=await User.findByIdAndUpdate({_id:userId},
        {
          $push:{
            courses:courseId
          }
        },
        {new:true}
      )
      const UserDetail=await User.findById(userId);
      sendEmail(UserDetail.email,"From studyNotion regards with the course Buying",`Successfully purchased course ${courseId}`);
      res.status(200).json({
        success:true,
        message:"User and Course both are updated successfully"
      })
    }
    else{
      return res.status(400).json({
        success:false,
        messsage:"Something went wrong in verfy signature from razrpay pls try again later"
      })
    }
  }
  catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    })
  }
}