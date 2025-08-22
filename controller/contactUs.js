const Contact=require('../models/Contact')
const User=require('../models/User')
const mongoose=require('mongoose')


exports.sendContactMessage=async(req,res)=>{
  try{
    const {firstName,lastName,email,phNumber,textarea}=req.body;
    if(!firstName || !lastName || !email || !phNumber || !textarea){
      return res.status(402).json({
        success:false,
        message:"All fields are required"
      })
    }
    const user=await User.findOne({email:email});
    if(!user){
      return res.status(400).json({
        success:false,
        messagae:"Please SingUp first"
      })
    }
    const resultInfo=await Contact.create({
      firstName:firstName,
      lastName:lastName,
      email:email,
      phNumber:phNumber,
      message:textarea
    })
    if(!resultInfo){
      return res.status(403).json({
        success:false,
        message:"Message not delivered"
      })
    }
    return res.status(200).json({
      success:true,
      message:"Message Successfully Delivered"
    })
  }
  catch(err){
    return res.status(503).json({
      success:false,
      body:err.message,
      message:"Contact Us Message not Delivered"
    })
  }
}