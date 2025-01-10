
if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
    
}



const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing =require("./models/listing.js");
const review=require("./models/review.js");
const path=require("path");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const { listingSchema,reviewSchema }=require("./schema.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter =require("./routes/review.js");
const userRouter =require("./routes/user.js");

const session =require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const user=require("./models/user.js");

app.set("view engine","ejs");
app.engine("ejs",ejsMate);
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));


const methodOverride=require("method-override");
app.use(methodOverride("_method"));
let port=3000;

let dburl=process.env.ATLAS_DB;
main().then(()=>{
    console.log("Connection successful");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(dburl);
}

const store= MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24*3600,
})

store.on(("error"),()=>{
    console.log("error in mongo session store",err);
})
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    console.log(res.locals.success);
    next();
})

app.use("/listings",listingRouter);

app.use("/listings/:id/reviews",reviewRouter);

app.use("/",userRouter);

// app.get("/",(req,res)=>{
//     res.send("Hii mate");
// });

// app.get("/user",async(req,res)=>{
//     let fakeUser=new user({
//         email:"altamashkhan9315@gmail.com",
//         username:"altamash"
//     });
//     let registeredUser=await user.register(fakeUser,"saniya@1");
//     res.send(registeredUser);
// })
// app.get("/testlisting",(req,res)=>{
//     let list=new Listing({
//         title:"Altamash",
//         description:"Big Fan",
//         price:3000,
//         location:"Mumbai",
//         country:"India"
//     })
//     list.save();
//     console.log(list);
//     res.send("success");
// })
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("listings/error.ejs",{message});
})

app.listen(port,()=>{
    console.log('Server Start');
})