const mongoose=require('mongoose')

const courseProgressSchema=new mongoose.Schema({
  course:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course",
  },
  completedVideo:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Subsection"
  }]
})

module.exports=mongoose.model("CourseProgress",courseProgressSchema)