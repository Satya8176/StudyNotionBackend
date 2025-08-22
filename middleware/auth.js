const user=require('../models/User')
const jwt=require('jsonwebtoken')
require('dotenv').config()

exports.auth=async (req , res , next)=>{
  try{
    const token=req.cookies.token || req.body.token ;
    if(!token){
      return res.status(400).json({
        success:false,
        message:"Token does not found"
      })
    }
    try{
      const decode=jwt.verify(token,process.env.JWT_SECRET);
      req.user=decode;
      
    }
    catch(err){
      return res.status(402).json({
        success:false,
        message:"Invalid Token"
      })
    }
    next();

  }
  catch(err){
    return res.status(500).json({
      success:false,
      message:"There is any internal issure "
    })
  }
}

exports.isStudent=async (req , res, next)=>{
  try{
    if(req.user.accountType !== "Student"){
      return res.status(402).json({
        success:false,
        message:"This route is only for the student"
      })
    }
    next();
  }
  catch(err){
    return res.status(500).json({
      success:false,
      message:"User role cannot be verified"
    })
  }
}
exports.isInstructor=async (req , res, next)=>{
  try{
    if(req.user.accountType !=="Instructor"){
      return res.status(402).json({
        success:false,
        message:"This route is only for the Instructor"
      })
    }
    next();
  }
  catch(err){
    return res.status(500).json({
      success:false,
      message:"Instructor role cannot be verified"
    })
  }
}
exports.isAdmin=async (req , res, next)=>{
  try{
    if(req.user.accountType !=="Admin"){
      return res.status(402).json({
        success:false,
        message:"This route is only for the Admin"
      })
    }
    next();
  }
  catch(err){
    return res.status(500).json({
      success:false,
      message:"Admin role cannot be verified"
    })
  }
}
