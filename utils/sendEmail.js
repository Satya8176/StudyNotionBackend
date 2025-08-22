const nodemailer=require('nodemailer');
require('dotenv').config()

const sendEmail=async (email,title,body)=>{
  const transporter=nodemailer.createTransport({
    host:process.env.MAIL_HOST,
    auth:{
      user:process.env.MAIL_USER,
      pass:process.env.MAIL_PASS
    }
  })
  let info=await transporter.sendMail({
    from:"StudyNotion in regard with the Course",
    to:email,
    subject:title,
    html:body
  })
}

module.exports=sendEmail