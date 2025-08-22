const express=require('express')
const router=express.Router()

const {sendOTP,singUp,signIn,changePassword, logOut}=require('../controller/auth')
const {resetPasswordToken,resetPassword}=require('../controller/ResetPassword')
const {auth}=require('../middleware/auth')

//              AUTHENTICATION ROUTES

// all in this page are tested and work fine 

//router for log in
router.post('/login',signIn);

//route for sing up
router.post('/signup',singUp);

// route for send OTP
router.post('/sendotp',sendOTP)

router.post('/changepassword',auth,changePassword);

router.get('/logOut',auth,logOut);


//                       RESET PASSWORD

router.post('/reset-password-token',resetPasswordToken)

router.post('/reset-password',resetPassword)

module.exports=router;