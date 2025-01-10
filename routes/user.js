const express=require("express");
const router=express.Router();
const user =require("../models/user.js");
const ExpressError=require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveurl}=require("../middleware.js");
const usercontroller=require("../controllers/users.js");

router.route("/signup")
.get((usercontroller.getsignup))
.post((usercontroller.signup))


router.route("/login")
.get((usercontroller.getlogin))
.post(saveurl,
    passport.authenticate("local",{failureRedirect:"/login",failureFlash:true,}),
    (usercontroller.login))



router.get("/logout",(usercontroller.logout))


module.exports=router;



