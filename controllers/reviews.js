const review=require("../models/review.js");
const Listing =require("../models/listing.js");

module.exports.new=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newreview=new review(req.body.review);
    
    newreview.author=req.user.id;
    console.log(newreview);
    listing.reviews.push(newreview) ;

    
    await newreview.save();
    await listing.save();
    req.flash("success","review is saved");
    res.redirect(`/listings/${listing.id}`);
}

module.exports.delete=async(req,res)=>{
    let {id,reviewId}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
     let reviews=await review.findByIdAndDelete(reviewId);
    console.log(reviews.author);
    req.flash("error","review is deleted");
    res.redirect(`/listings/${id}`)
}