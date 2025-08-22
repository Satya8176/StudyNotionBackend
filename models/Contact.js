const mongoose=require('mongoose');
const sendEmail = require('../utils/sendEmail');
require('dotenv').config()


const contactSchema=new mongoose.Schema({
  firstName:{
    type:String,
    required:true
  },
  lastName:{
    type:String
  },
  email:{
    type:String,
    required:true
  },
  phNumber:{
    type:String,
    required:true
  },
  message:{
    type:String,
    required:true
  }
})

contactSchema.post("save",async function (docs) {
  try{
    const body = `
                  <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
                      <div style="padding: 30px; text-align: center;">
                        <h1 style="color: #4A90E2; margin-bottom: 10px;">Message From ${docs.firstName} ${docs.lastName}!</h1>
                        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                          Email is <strong>${docs.email}</strong>,<br/>
                          Phone Number is <strong>${docs.phNumber}</strong>,<br/>
                        </p>
                        <p style="font-size: 15px; color: #555;">
                        Message is <br/>
                          ${docs.message}
                        </p>
                        <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />
                      </div>
                    </div>
                  </div>
                `;
    const info=await sendEmail(
          process.env.MAIL_USER,
          "Message From StudySprout Regard Contact Message",
          body
        )

  }
  catch(err){
    return res.status(400).json({
      success:false,
      message:"Post Middleware of Contact Us not worked"
    })
  }
  
})



module.exports=mongoose.model("Contact",contactSchema);