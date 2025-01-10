const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const { listingSchema,reviewSchema }=require("../schema.js");
const review=require("../models/review.js");
const Listing =require("../models/listing.js");
const {isloggedin,isowner,isreviewauthor}=require("../middleware.js");
const reviewcontroller=require("../controllers/reviews.js");

const reviewValidation=(err,req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    console.log(error);
    if(error){
       throw new ExpressError(400,"Please fill the form ");
    }else{
        next();
    }
};

router.post("/",reviewValidation,
    isloggedin,wrapAsync(reviewcontroller.new));

router.delete("/:reviewId",isloggedin,isreviewauthor,(reviewcontroller.delete))

module.exports=router;