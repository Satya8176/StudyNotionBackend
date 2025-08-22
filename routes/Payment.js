const express=require('express')
const router=express.Router();

const {capturePayment,verifySignature}=require('../controller/Payment')
const {auth,isStudent,isInstructor,isAdmin}=require('../middleware/auth');

router.post('/capturePayment',auth,capturePayment);
// router.post('/verifySignature',verifySignature);

module.exports=router

// router.post('/capturePayment',auth,isStudent,capturePayment);