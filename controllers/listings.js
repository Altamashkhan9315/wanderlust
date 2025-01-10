const Listing =require("../models/listing.js");
const review=require("../models/review.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
    const alllistings=await Listing.find({});
    res.render("listings/index.ejs",{alllistings});
}

module.exports.delete=async (req,res)=>{
    let {id,reviewId}=req.params;
    let deleted=await Listing.findByIdAndDelete(id).populate("reviews");
    await review.findByIdAndDelete(id,{reviews:reviewId});
    req.flash("error","listing deleted");
    res.redirect("/listings");
    console.log(deleted);
}

module.exports.show=async(req,res)=>{
    let{id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","listing doesn't exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.update=async(req,res)=>{
   
    let{id}=req.params;
    let {list} = req.body;
    let listing =await Listing.findByIdAndUpdate(id,{
        title:list.title,
        description:list.description,
        image:list.image,
        price:list.price,
        location:list.location,
        country:list.country
    }); 
    if(req.file){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image={url,filename};
    listing.save();
}
    req.flash("success","changed successfully");
    res.redirect(`/listings/${id}`);
    // console.log(list);
}
module.exports.new=(req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.create=async(req,res,next)=>{
    let response=await geocodingClient.forwardGeocode({
        query:req.body.list.location,
        limit:1
    })
    .send();

    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,"...",filename);
    let {list} = req.body;
    let listing=new Listing({
        title:list.title,
        description:list.description,
        price:list.price,
        location:list.location,
        country:list.country
    });
    console.log(req.user);
    listing.owner=req.user.id;
    listing.image={url,filename};
    listing.geometry=response.body.features[0].geometry;
   
    let saved = await listing.save().then(()=>{
        console.log("saved");
    })
    req.flash("success","New listing created");
    res.redirect("/listings");

}

module.exports.renderupdate=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    let url=listing.image.url;
    url=url.replace("/upload","/upload/w_250");
    res.render("listings/update.ejs",{listing,url});
}


