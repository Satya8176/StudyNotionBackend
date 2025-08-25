const express=require('express')
const app=express()
const bodyParser = require("body-parser");
const crypto = require("crypto");
const cors=require('cors')
const database=require('./config/database')
const cookieParser=require('cookie-parser')
const {cloudinaryConnect}=require('./config/cloudinary')
const fileUpload=require('express-fileupload')
const dotenv=require('dotenv');

// app.use(cors({origin:true}))
// app.use(cors({
//   origin: "https://study-notion-front-end-livid.vercel.app", // ✅ exact domain
//   credentials: true
// }));


//Here when in the place of these url when we deploy the frontend then here we paste out the frontend app link

// ✅ Allow your frontend + localhost (for dev)
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
//data base connection here 
database();
const allowedOrigins = [
  "https://study-notion-front-end-livid.vercel.app",
  "http://localhost:5173/"
];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true // ✅ allows cookies / Authorization headers
}));


//rotues are imported here 
const userRoute=require('./routes/User');
const courseRoute=require('./routes/Course');
const paymentRoute=require('./routes/Payment');
const profileRoute=require('./routes/Profile');
const contactRoute=require('./routes/Contact');


const { verifySignature } = require('./controller/Payment');

dotenv.config()
const PORT=process.env.PORT || 3000;


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
  return res.send("App is working fine");
  // return res.json({
  //   success:true,
  //   message:`App is running...`
  // })
})

app.listen(PORT,()=>{
  console.log(`App is running at port ${PORT}`)
})