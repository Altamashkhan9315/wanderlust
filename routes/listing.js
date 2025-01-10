const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const { listingSchema,reviewSchema }=require("../schema.js");
const Listing =require("../models/listing.js");
const review=require("../models/review.js");
const {isloggedin,isowner}=require("../middleware.js");
const listingcontroller=require("../controllers/listings.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });


const listValidation=(err,req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    console.log(error);
    if(error){
       throw new ExpressError(400,"Please fill the form ");
    }else{
        next();
    }
};
router.get("/new",isloggedin,(listingcontroller.new));

router.route("/").get(wrapAsync(listingcontroller.index))
.post(isloggedin,upload.single('list[image]'),listValidation,(listingcontroller.create));

router.route("/:id")
.delete(isloggedin,isowner,wrapAsync(listingcontroller.delete))
.get(wrapAsync(listingcontroller.show))
.put(isloggedin,isowner,upload.single('list[image]'),listValidation,wrapAsync(listingcontroller.update));





router.get("/:id/edit",isloggedin,wrapAsync(listingcontroller.renderupdate));

module.exports=router;