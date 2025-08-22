const User = require('../models/User');
const sendEmail=require('../utils/sendEmail')
const bycript=require('bcrypt')
const crypto=require('crypto')


exports.resetPasswordToken=async (req , res)=>{
  try{
    const {email}=req.body;
    if(!email){
      return res.status(400).json({
        success:false,
        message:"Please enter the email"
      })
    }
    // console.log("I am here ")
    if(! await User.findOne({email})){
      return res.status(403).json({
        success:false,
        message:"Enter a valid email ; Email not found in data base "
      })
    }
    const token=crypto.randomUUID();
    // console.log("i am here ")
    const response=await User.findOneAndUpdate({email:email},{token:token,expireTokenTime:Date.now() + 5*60*1000},{new:true});
    
    const url=`http://localhost:5173/updatePassword/${token}`

  const body = `
    <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
      <div style="max-width: 500px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        <div style="padding: 20px; text-align: center;">
          <h2 style="color: #4A90E2; margin-bottom: 10px;">🔐 Reset Passwrod Link is Below</h2>
          <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
            Use the link given below to change your Password:
          </p>
          <div style="font-size: 15px; font-weight: bold; color: #111; margin: 20px 0;">
            ${url}
          </div>
          <p style="font-size: 14px; color: #777;">
            This link is valid for the next 5 minutes.
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 13px; color: #999;">
            If you didn’t request this, please ignore this email.
          </p>
          <p style="font-size: 13px; color: #999; margin-top: 10px;">
            — StudyNotion Team (Satya)
          </p>
        </div>
      </div>
    </div>
  `;
    await sendEmail(email,"Reset Password Link From StudyNotion",body);
    // console.log("I am here Now......")
    return res.status(200).json({
      success:true,
      response,
      message:"Successfully sent mail please check email for further steps"
    })

  }
  catch(err){
    return res.status(500).json({
      success:false,
      message:"There is an error while generatin reset password token"
    })
  }
}

exports.resetPassword=async (req, res)=>{
  try{
    const {password,confirmpassword, token}=req.body;
    if(password !== confirmpassword){
      return res.status(400).json({
        success:false,
        message:"Please fill out the same password in both field"
      })
    }
    const userDetail=await User.findOne({token:token});
    if(!userDetail){
      return res.status(400).json({
        success:false,
        message:"User detail not found please sign up again"
      })
    }
    if(Date.now > userDetail.expireTokenTime){
      return res.status(403).json({
        success:false,
        message:"Token timeout please regenrate token "
      })
    }
    const hashedPassword= await bycript.hash(password,10);
    const response=await User.findOneAndUpdate({token:token},{password:hashedPassword},{new:true});
    return res.status(200).json({
      success:true,
      body:response,
      message:"Password changed successfully"
    })
  }
  catch(err){
    return res.status(500).json({
      success:false,
      message:"there is an error"
    })
  }
}