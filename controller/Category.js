const Category=require('../models/Category')


// HERE IN THIS CREATECATEGORY AND GET ALL CATEGORY WORKS FINE 
// LATER WE CHECK THE CATEGORY PAGE DETAIL

exports.createCategory= async(req , res)=>{
  try{
    const {categoryName,description}=req.body;
    if(!categoryName || !description){
      return res.status(422).json({
        success:false,
        message:"ALl field are neccssary"
      })
    }
    const response=await Category.create({
      categoryName:categoryName,
      description:description
    })
    console.log(response); 
    return res.status(200).json({
      success:true,
      message:"Category created Successfully"
    })
  }
  catch(err){
    return res.status(500).json({
      success:false,
      message:err.message
    })
  }
}


exports.showAllcategory=async (req,res)=>{
  try{
    const response=await Category.find({},{categoryName:true,description:true});
    return res.status(200).json({
      success:true,
      body:response
    })
  }
  catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    })
  }
}

exports.categoryPageDetail=async(req , res)=>{
  try{
    const categoryId=req.body.categoryId;
    const selectedCategory=await Category.find({
      _id:categoryId
    })
    .populate({
      path:"course",
      match: { isDraft: false }, 
      populate:{
              path:"courseContent",
              populate:{
                path:"subsection"
              }
           }
    })
    // .exec()
    if(!selectedCategory){
      return res.status(500).json({
        success:false,
        message:"There is no course till now for this Category"
      })
    }
    const diffrentCategory=await Category.find({
      _id:{
        $ne:categoryId,
      }
    })
    .populate({
      path:"course",
      match: { isDraft: false }, 
      populate:{
              path:"courseContent",
              populate:{
                path:"subsection"
              }
           }
    })

    // here there is a to do in which we have to perform task like we have to fetch only top 10 selling course
    return res.status(200).json({
      success:true,
      message:"data fetched successfully",
      data:selectedCategory,
      diffdata:diffrentCategory
    })
  }
  catch(err){
    return res.status(500).json({
      success:false,
      message:err.message
    })
  }
}