const express=require('express')
const router=express.Router();
const {auth}=require('../middleware/auth')


// HERE IN THIS ALL THE ROUTES OTHER THAN DELETEPROFILE ARE WORKED SUCCESSFULLY (todo is that WE HAVE TO CEHCK FOR THE getEnrolledCourses handler once when we insert any course in the user or create a course from the user )

const {updateProfile,deleteProfile,getUserDetail, getEnrolledCourse, getInstructorCourse, changeProfilePic}=require('../controller/Profile')

router.delete('/deleteProfile',deleteProfile);
router.put('/updateProfile',auth,updateProfile);
router.get('/getUserDetail',auth,getUserDetail);
router.get('/getEnrolledCourse',auth,getEnrolledCourse);
router.get('/getMyCourses',auth,getInstructorCourse);
router.put('/changeProfilePic',auth,changeProfilePic);

module.exports=router;