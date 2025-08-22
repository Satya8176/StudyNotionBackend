const express=require('express')
const app=express()
const cors = require('cors');
const bodyParser = require("body-parser");
const crypto = require("crypto");


// app.use(
//   cors({
//     origin: '*',  // Your frontend
//     credentials: true
//   })
// );

const allowedOrigins = [
  "http://localhost:5173",
  "https://06675f305432.ngrok-free.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true // 🔐 allow cookies and sessions
}));

// app.use(express.json({ type: '*/*' }));


//  WE HAVE TO CHECK WHY VIDEO IS NOT UPLOADED AND WHY WHEN WE DELETE SUBSECTION THEN WHY IT IS NOT REMOVED FORM THE SECTION AND SOME OTHER TESTING

//rotues are imported here 
const userRoute=require('./routes/User');
const courseRoute=require('./routes/Course');
const paymentRoute=require('./routes/Payment');
const profileRoute=require('./routes/Profile');
const contactRoute=require('./routes/Contact');

const database=require('./config/database')
const cookieParser=require('cookie-parser')
const {cloudinaryConnect}=require('./config/cloudinary')
const fileUpload=require('express-fileupload')
const dotenv=require('dotenv');
const { verifySignature } = require('./controller/Payment');

dotenv.config()
const PORT=process.env.PORT || 3000

//data base connection here 
database();


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// app.use(cors());

app.use(
  fileUpload(
    {
      useTempFiles: true,
      tempFileDir: "/tmp/",
    }
  )
)

//cloudinary connect 
cloudinaryConnect();

// app.post(
//   "/api/v1/payment/verifySignature",
//   bodyParser.raw({ type: "application/json" }), // match Razorpay's Content-Type
//   async (req, res) => {
//       try{
//           console.log("I am here in verify Signature");
//           // console.log("REw is ",req)
//           const webHookSecret="12345678";//this is from the server we have 
//           const signature=req.headers["x-razorpay-signature"];//this is the secret from the razorpay 
//           const shasum=crypto.createHmac("sha256",webHookSecret);
//           shasum.update(JSON.stringify(req.body));
//           const digest=shasum.digest("hex");
//           if(digest.trim() === signature.trim()){
//             console.log("Payment is authorised  I have to readh here ")
//             const {courseId,userId}=req.body.payload.payment.entity.notes;
//             const updateCourse=await Course.findByIdAndUpdate({_id:courseId},
//               {
//                 $push:{
//                   studentEnrolled:userId
//                 }
//               },
//               {new:true}
//             )
//             const updateUser=await User.findByIdAndUpdate({_id:userId},
//               {
//                 $push:{
//                   courses:courseId
//                 }
//               },
//               {new:true}
//             )
//             const UserDetail=await User.findById(userId);
//             sendEmail(UserDetail.email,"From studyNotion regards with the course Buying",`Successfully purchased course ${courseId}`);
//             res.status(200).json({
//               success:true,
//               message:"User and Course both are updated successfully"
//             })
//           }
//           else{
//             return res.status(400).json({
//               success:false,
//               messsage:"Something went wrong in verfy signature from razrpay pls try again later"
//             })
//           }
//         }
//      catch (err) {
//       console.error("🔥 Error in webhook handler:", err);
//       return res.status(500).json({ error: "Internal server error" });
//     }
//   }
// );



//app routes mounted here
app.use("/api/v1/auth",userRoute)
app.use("/api/v1/profile",profileRoute)
app.use("/api/v1/course",courseRoute)
app.use("/api/v1/payment",paymentRoute)
app.use("/api/v1/contact",contactRoute);


//this only route for the razor pay 
app.post(
  "/api/v1/payment/verifySignature",
  bodyParser.raw({ type: "application/json" }),
  verifySignature
);

app.get('/', (req ,res)=>{
  return res.json({
    success:true,
    message:`Server is runnign fine`
  })
})

app.listen(PORT,()=>{
  console.log(`App is running at port ${PORT}`)
})