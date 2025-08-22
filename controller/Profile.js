const Profile=require('../models/Profile')
const User=require('../models/User')
const Course=require('../models/Course')
const uploadImageCloudinary=require('../utils/uploadImageCloudinary')

exports.updateProfile=async (req , res)=>{
  try{
    // console.log("i am here ")
    const {gender,dateOfBirth="",about="",contactNumber="",profession="",firstName="",lastName=""}=req.body;
    // console.log(req.body)
    if(!gender){
      return res.status(400).json({
        success:false,
        message:"Please fill all the neccssary details"
      })
    }
    const userId=req.user.id;
    if(!userId){
      return res.status(400).json({
        success:false,
        message:"User not found Please login again"
      })
    }
    const userDetail=await User.findById(userId);
    if(!userDetail){
      return res.status(400).json({
        success:false,
        message:"User not found Please signUp first"
      })
    }
    
    const updateFLname=await User.findByIdAndUpdate({_id:userId},
      {
        firstName:firstName,
        lastName:lastName
      },
      {new:true}
    )
    const profileId=userDetail.additionalDetal;
    // console.log(profileId)
    const profileDetail=await Profile.findById(profileId);
    profileDetail.gender=gender;
    profileDetail.profession=profession;
    profileDetail.about=about;
    profileDetail.dateOfBirth=dateOfBirth;
    profileDetail.contactNumber=contactNumber;
    await profileDetail.save();
    return res.status(200).json({
      success:true,
      message:"Profile updated successfully"
    })

  }
  catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    })
  }
}

exports.deleteProfile=async (req,res)=>{
  try{
    const userId=req.user.id;
    if(!userId){
      return res.status(400).json({
        success:false,
        message:"User not found "
      })
    }
    const userDetail=await User.findById(userId);
    const profileId=userDetail.additionalDetal;
    await Profile.findByIdAndDelete(profileId);
    if(userDetail.accountType=="Student"){
      let index=0;
      while(userDetail.courses.length !==0){
        let couseId=userDetail.courses[index];
        await Course.findByIdAndUpdate(
          {_id:couseId},
          {
            $pull:{
              studentEnrolled:userId
            }
          },
          {new:true}
        )
      }
    }
    await User.findByIdAndDelete(userId);
    return res.status(200).json({
      success:true,
      message:"User account deleted successfully"
    })
  }
  catch(err){
    return res.status(500).json({
      success:false,
      message:err.message
    })
  }
}

exports.getUserDetail=async (req,res)=>{
  try{
    const userId=req.user.id;
    const userDetail=await User.findById(userId)
                     .populate({
                        path:"additionalDetal"
                      })
                      .populate({
                        path:"courses"
                      })
                      .exec();
    if(!userDetail){
      return res.status(400).json({
        success:false,
        message:"User not found"
      })
    }
    return res.status(200).json({
      success:true,
      message:"data fetched successfully",
      data:userDetail
    })
  }
  catch(err){
    console.error(err);
    res.status(500).json({
      success:false,
      message:"Something went wrong while fetching user detail"
    })
  }
}

exports.getEnrolledCourse=async (req, res)=>{
  try{
    const userId=req.user.id;
    if(!userId){
      return res.status(400).json({
        success:false,
        message:"Please sign in again"
      })
    }
    const result=await User.findById(userId)
                               .populate({
                                path:"courses",
                                select:"courseName courseDescription whatYouWillLearn courseContent ratingAndReview thumbnail category",
                                populate:[
                                  { path: "category",
                                    select:"categoryName description course"
                                   },
                                  { path: "ratingAndReview" },
                                  {
                                    path:"instructor",
                                    select: "firstName lastName image email" ,
                                    populate:{
                                      path:"additionalDetal",
                                      select:"gender about contactNumber profession"
                                    }
                                  },
                                  {path:"courseContent",
                                    populate:{
                                      path:"subsection"
                                    }
                                  }
                                  ]
                                }) 
    if(!result){
      return res.status(400).json({
        success:false,
        message:"User not found "
      })
    }
    const data=result.courses;
    if(!data){
      return res.status(400).json({
        success:false,
        message:"Therer is not any course "
      })
    }
    return res.status(200).json({
      success:true,
      data:data,
      message:"Courses fetched successfully"
    })

  }
  catch(err){
    return res.status(500).json({
      success:false,
      message:err.message
    })
  }
}

exports.getInstructorCourse=async (req, res)=>{
  try{
    const userId=req.user.id;
    if(!userId){
      return res.status(400).json({
        success:false,
        message:"Please sign in again"
      })
    }
    const result=await User.findById(userId)
                               .populate({
                                path:"courses"
                                }) 
    if(!result){
      return res.status(400).json({
        success:false,
        message:"User not found "
      })
    }
    const data=result.courses;
    if(!data){
      return res.status(400).json({
        success:false,
        message:"Therer is not any course "
      })
    }
    return res.status(200).json({
      success:true,
      data:data,
      message:"Courses fetched successfully"
    })

  }
  catch(err){
    return res.status(500).json({
      success:false,
      message:err.message
    })
  }
}

exports.changeProfilePic=async (req,res)=>{
  try{
    const profile=req.files.profilePic;
    if(!profile){
      return res.status(404).json({
        success:false,
        message:"File not selected"
      })
    }
    const response=await uploadImageCloudinary(profile,process.env.CLOUD_FOLDER,300,300);
    const userId=req.user.id;
    const userDetail=await User.findByIdAndUpdate(
      {_id:userId},
      {
        image:response.secure_url
      },
      {new:true}
    )
    return res.status(200).json({
      success:true,
      message:"User Profile updated"
    })
  }
  catch(err){
    return res.status(505).json({
      success:false,
      message:"Some Error occur in Changing Profile",
      body:err.message
    })
  }
}