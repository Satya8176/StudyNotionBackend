const express=require('express');
const router=express.Router();
const { sendContactMessage } = require('../controller/contactUs');


router.post('/sendContactMessage',sendContactMessage);

module.exports=router