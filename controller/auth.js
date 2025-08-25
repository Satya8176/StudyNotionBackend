const User=require('../models/User')
const OTP=require('../models/OTP')
const otpGenerator=require('otp-generator')
const bycript=require('bcrypt')
const jwt=require('jsonwebtoken')
const sendEmail=require('../utils/sendEmail')
const Profile=require('../models/Profile');
require('dotenv').config()

//send OTP

// Here is the format for the otp send email 



exports.sendOTP = async (req ,res )=>{
  try{
    const {email}=req.body;
    
    const chechEmailPresent=await User.findOne({email:email});
    if(chechEmailPresent){
      return res.status(401).json({
        success:false,
        message:"User already Exist"
      })
    }
    
    let otp=otpGenerator.generate(6,{
      upperCaseAlphabets:false,
      lowerCaseAlphabets:false,
      specialChars:false
    })
    
    const result=await OTP.findOne({otp:otp});
    while(result){
      otp=otpGenerator.generate(6,{
      upperCaseAlphabets:false,
      lowerCaseAlphabets:false,
      specialChars:false
      })
      result=await OTP.findOne({otp:otp});
    }
    const otpPayload={
    otp,
    email,
  }
  const otpbody=await OTP.create(otpPayload);

  //Here this is the format for the otp 
  const body = `
    <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
      <div style="max-width: 500px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="padding: 20px; text-align: center;">
          <h2 style="color: #4A90E2; margin-bottom: 10px;">🔐 Verify Your Email</h2>
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Use the following OTP to complete your signup process:
          </p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #111; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #777;">
            This OTP is valid for the next 5 minutes.
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 13px; color: #999;">
            If you didn’t request this, please ignore this email.
          </p>
          <p style="font-size: 13px; color: #999; margin-top: 10px;">
            — StudyNotion Team
          </p>
        </div>
      </div>
    </div>
  `;

  sendEmail(email,"Verification mail from Ed.Tech from Satya",body)
  return res.status(200).json({
    success:true,
    message:"Otp generated successfully",
    otp,
  })
  }
  catch(err){
    res.status(500).json({
      success:false,
      message:"Internal server error"
    })
  }
}


//singUP

exports.singUp=async (req , res)=>{
  try{
    const {firstName,lastName,email,password,confirmPasseord,accountType,otp}=req.body;
    if(!firstName || !lastName | !email || !password || !confirmPasseord || !otp){
      return res.status(402).json({
        success:false,
        message:"All field are neccessary"
      })
    }
    if(password != confirmPasseord){
      return res.status(403).json({
        success:false,
        message:"confirm pass and apss is not matched "
      })
    }

    const checkpresence=await User.findOne({email});
    if(checkpresence){
      return res.status(405).json({
        success:false,
        message:"User already exist"
      })
    }
    
    const recentOtps=await OTP.find({email}).sort({createdAt:-1}).limit(1);
    if(recentOtps.length===0){
      return res.status(400).json({
        success:false,
        message:"Internal OTP error"
      })
    }
    const recentOtp=recentOtps[0].otp;
    if(otp != recentOtp){
      return res.status(407).json({
        success:false,
        message:"Otp does not match "
      })
    }
    
    const hashedpasswd=await bycript.hash(password,10);
    const profile=await Profile.create({
      gender:null,
      dateOfBirth:null,
      about:null,
      contactNumber:null,
      profession:null
    })
    
    const responseUser=await User.create({
      firstName,
      lastName,
      email,
      password:hashedpasswd,
      accountType,
      additionalDetal:profile._id,
      image:`https://api.dicebear.com/8.x/initials/svg?seed=${firstName} ${lastName}`
    })

    return res.status(200).json({
      success:true,
      data:responseUser,
      message:"User is registered successfully"
    })

  }
  catch(err){
    return res.status(500).json({
      success:false,
      message:"User not regitered "
    })
  }
}


exports.signIn=async (req , res)=>{
  try{
    const {email,password}=req.body;
    if(!email || !password ){
      return res.status(403).json({
        success:false,
        message:"Enter email and password"
      })
    } 
    const user=await User.findOne({email});
    if(!user){
      return res.status(402).json({
        success:false,
        message:"User does not exist please sign up first"
      })
    }
    if(await bycript.compare(password,user.password)){
      const payload={
        email:user.email,
        id:user._id,
        accountType:user.accountType
      }
      const token=jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:"4h"
      })
      user.token=token;
      user.password=undefined;
      const options={
        expires:new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly:true,
        secure: true,          // ✅ required for cross-origin
        sameSite: "None",     
      }
      res.cookie("token",token,options).status(200).json({
        success:true,
        user,
        token,
        message:"Logged In successfully"
      })

    }
    else{
      return res.status(408).json({
        success:false,
        message:"password is incorrect"
      })
    }
  }
  catch(err){
    return res.status(500).json({
      success:false,
      message:"There is any server issue please try again later"
    })
  }
}


// change password

exports.changePassword = async (req ,res )=>{
  try{
    const {email,oldPassword,newPassword}=req.body;
    if( !email ||!oldPassword || !newPassword ){
      return res.status(403).json({
        success:false,
        message:"All field are neccessary to fil",
      })
    }
    
    const userDetail=await User.findOne({email})
    if(!userDetail){
      return res.status(424).json({
        success:false,
        message:"User not found"
      })
    }
    if(!await bycript.compare(oldPassword,userDetail.password)){
      return res.status(402).json({
        success:false,
        message:"Password not correct"
      })
    }
    const hashedpasswd=await bycript.hash(newPassword,10);
    const response=await User.findByIdAndUpdate({_id:userDetail._id},{password:hashedpasswd},{new:true});
    return res.status(200).json({
      success:true,
      message:"Password changed successfully"
    })
  }
  catch(err){
    // console.error(err);
    // console.log(err.message);
    res.status(500).json({
      success:true,
      message:"Some thing bad has happened Please try again later"
    })
  }
}

exports.logOut = async (req,res)=>{
  try{
    res.clearCookie(
      "token",{httpOnly: true}
    ).status(200).json({
      success:true,
      message:"User LogOut Successfully"
    })
  }
  catch(err){
    res.status(500).json({
      message:err.message
    })
  }
}