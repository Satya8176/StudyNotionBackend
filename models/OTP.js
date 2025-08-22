const mongoose=require('mongoose');
const sendEmail = require('../utils/sendEmail');

const otpSchema=new mongoose.Schema({
  email:{
    type:String,
    required:true,
    trim:true,
  },
  otp:{
    type:Number,
    required:true,
  },
  createdAt:{
    type:Date,
    default:Date.now,
    expires:300,
  }
})

async function verificationMail(email,otp) {
  try{
    const mailresponse=await sendEmail(email,"Verificatin mail from StudyNotion",otp);
    // console.log("Email send successfully",mailresponse);

  }
  catch(err){
    console.log("Error while sending otp to the mail",err.message);
  }
}



module.exports=mongoose.model("OTP",otpSchema);
