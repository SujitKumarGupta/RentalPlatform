const express=require("express");
const router=express.Router({mergeParams: true});
const wrapAsync = require("../utli/wrapAsync.js");
const Errorclass=require("../utli/Errorclass.js");
const Review=require("../models/review.js");
const listing=require("../models/listing");
const {validatereview,isLoggedIn,isReviewAuthor}=require("../middelware.js");
const reviewcontroller=require("../controllers/review.js");
 
   //review
   //post reviews
   router.post("/",isLoggedIn,validatereview, wrapAsync(reviewcontroller.createreview));
 
   //review delete
   router.delete("/:reviewid",isLoggedIn,isReviewAuthor,wrapAsync(reviewcontroller.deletereview));
    

   module.exports=router;