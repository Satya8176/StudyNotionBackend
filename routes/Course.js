const express=require('express')
const router=express.Router();

const {auth,isStudent,isInstructor,isAdmin}=require('../middleware/auth')
const {createCourse,showAllCourses,getCourseDetails, getAllSection, getDraftCourseDetail, updateCourse, updateDraftCourse, deleteCourse}=require('../controller/course')
const {createSection,updateSection,deleteSection, fetchSubSection}=require('../controller/Section')
const {createSubSection,updateSubSection,deletesubsection, getSubSectionDetail}=require('../controller/SubSection')
const {createCategory,showAllcategory,categoryPageDetail}=require('../controller/Category')
const {createRating,getAverageRating,getAllRating,getCourseRating}=require('../controller/ratingAndReview');
const { addToCart, deleteFromCart, getAllCartItems } = require('../controller/cart');


//              COURSE ROUTES

router.post('/createCourse',auth,isInstructor,createCourse);
router.put('/updateCourse',auth,isInstructor,updateCourse);
router.put('/updateDrafCourse',auth,isInstructor,updateDraftCourse)
router.delete('/deleteCourse',auth,isInstructor,deleteCourse)
router.post('/addSection',auth,isInstructor,createSection);
router.put('/updateSection',auth,isInstructor,updateSection);
router.delete('/deleteSection',auth,isInstructor,deleteSection);
router.post('/addSubSection',auth,isInstructor,createSubSection);
router.post('/getAllSection',auth,isInstructor,getAllSection);
router.put('/updateSubSection',auth,isInstructor,updateSubSection);
router.delete('/deleteSubSection',auth,isInstructor,deletesubsection);
router.post('/getSubSectionDetail',auth,getSubSectionDetail)
router.get('/showAllCourses',showAllCourses);
router.post('/showCourseDetail',getCourseDetails);
router.post('/draftCourseDetail',getDraftCourseDetail)
router.post('/getSubSections',auth,isInstructor,fetchSubSection);

 
//             CATEGORY DETAILS    

//             ONLY WE HAVE TO CHECK THE CATEGORY PAGE DETAIL 
router.post('/createCategory',auth,isAdmin,createCategory);
router.get('/showAllCategory',showAllcategory)
router.post('/categoryPageDetail',categoryPageDetail);

//          These rotues for the ratinga and reveiw

router.post('/createRating',auth,isStudent,createRating);
router.post('/averageRating',getAverageRating);
router.get('/getAllRating',getAllRating);
router.get('/getCourseRating',getCourseRating)


//      These are for the carts 
router.post('/addToCart',auth,addToCart);
router.delete('/deleteFromCart',auth,deleteFromCart);
router.get('/getAllCartItems',auth,getAllCartItems)

module.exports=router
