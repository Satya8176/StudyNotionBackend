const Cart = require("../models/Cart");
const User = require("../models/User");
const Course = require("../models/Course");

exports.addToCart=async (req,res)=>{
  try{
    const {courseId}=req.body;
    const userData=req.user;
    const result=await Cart.findOne(
      {cartUser:userData.email}
    )
    if(!result){
      const cartinfo=await Cart.create(
        {
          cartUser:userData.email
        }
      )
      const userinfo=await User.findOne(
        {email:userData.email}
      )
      userinfo.cart=cartinfo._id;
      await userinfo.save();
    }
    await Cart.findOneAndUpdate(
      {cartUser:userData.email},
      {
        $push:{
          courseIds:courseId
        }
      },
      {
        new:true
      }
    )
    return res.status(200).json({
      success:true,
      body:"Item Added successfully"
    })
    // console.log(userData);
  }
  catch(err){
    return res.status(500).json({
      success:false,
      message:"Error occured during adding to cart",
      body:err.message
    })
  }
}

exports.deleteFromCart=async (req,res)=>{
  try{
    const {courseId}=req.body;
    const userData=req.user;
    if(!courseId){
      return res.status(400).json({
        success:false,
        message:"Particular course is not found"
      })
    }
    await Cart.findOneAndUpdate(
      {cartUser:userData.email},
      {
        $pull:{
          courseIds:courseId
        }
      },
      {new:true}
    )
    return res.status(200).json({
      success:true,
      message:"Cart Deleted from the cart"
    })
  }
  catch(err){
    return res.status(500).json({
      success:false,
      message:"Item not deleted from the Cart"
    })
  }
}

exports.getAllCartItems=async(req,res)=>{
  try{
    const {email}=req.user;
    
    if(!email){
      return res.status(400).json({
        success:false,
        body:"Email not found"
      })
    }
    const userDetail=await User.findOne({email:email});
    if(userDetail.accountType === "Instructor"){
      return ;
    }
    const result=await Cart.findOne({cartUser:email})
                                      .populate({
                                      path:"courseIds",
                                      populate:[
                                        { path: "category" },
                                        { path: "ratingAndReview" }
                                      ]
                                    })
    if(!result){
      return res.status(400).json({
        success:false,
        message:"No data is found with this email"
      })
    }
    return res.status(200).json({
      success:true,
      body:result,
      message:"Data fetched successfully"
    })
  }
  catch(err){
    return res.status(500).json({
      success:false,
      message:"Item not fetched from the Cart"
    })
  }
}