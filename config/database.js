const mongoose=require('mongoose');
require('dotenv').config();

const dbConnect=()=>{
  mongoose.connect(process.env.MONGODB_URL,{
    useUnifiedTopology: true,
  })
  .then(()=>{
    console.log("DB connection is successfull")
  })
  .catch((err)=>{
    console.error(err);
    console.log("Error in connnection database");
    process.exit(1);
  })
}

module.exports=dbConnect;




    // useNewUrlParser: true,