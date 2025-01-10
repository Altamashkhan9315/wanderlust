const Listing=require("./models/listing.js");
const review=require("./models/review.js");
const { listingSchema,reviewSchema }=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");

module.exports.isloggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must have logged in");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveurl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};  
module.exports.isreviewauthor=async (req,res,next)=>{
    let{id,reviewid}=req.params;
    let Review = await review.findById(reviewid);
    console.log(Review);
    // if(!Review){
    //     req.flash("error","review not found");
    //     return res.redirect(`/listings/${id}`);
    // }
    // if(!Review.author.equals(res.locals.curruser.id)){
    //     req.flash("error","You dont have an access");
    //     return res.redirect(`/listings/${id}`);
    // }
    next();
}

module.exports.isowner=async (req,res,next)=>{
    let{id}=req.params;
    let {list} = req.body;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.curruser.id)){
        req.flash("error","You dont have an access");
        return res.redirect(`/listings/${id}`);
    }
    next();
}



