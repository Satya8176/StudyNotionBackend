const mongoose=require('mongoose')

const sectionSchema=new mongoose.Schema({
  sectionName:{
    type:String,
    required:true,
  },
  subsection:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"SubSection"
  }]
})

const subSection=require('./Subsection');
sectionSchema.pre("findOneAndDelete", async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) {
    await subSection.deleteMany({ _id: { $in: doc.subsections } });
  }
  next();
});

module.exports=mongoose.model("Section",sectionSchema)