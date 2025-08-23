const express=require('express')
const app=express()
const cors = require('cors');
const bodyParser = require("body-parser");
const crypto = require("crypto");

//Here when in the place of these url when we deploy the frontend then here we paste out the frontend app link

// ✅ Allow your frontend + localhost (for dev)
const allowedOrigins = [
  "http://localhost:5173", 
  "https://study-notion-front-end-livid.vercel.app/*"
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

// app.use(cors({
//   origin: true,       
//   credentials: true
// }));

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
const PORT=process.env.PORT || 3000;

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
  res.send("App is running...")
  return res.json({
    success:true,
    message:`App is running...`
  })
})

app.listen(PORT,()=>{
  console.log(`App is running at port ${PORT}`)
})