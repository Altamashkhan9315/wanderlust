const mongoose = require("mongoose");
const review=require("./review.js");



const Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename:String,
    url:String,
  },
  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"review"
    },
  ],
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
  },
  geometry:{
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

Schema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await review.deleteMany({id:{$in:listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", Schema);
module.exports = Listing;