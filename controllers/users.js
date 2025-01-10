const user =require("../models/user.js");

module.exports.getsignup=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }req.flash("success","You are logged out");
        res.redirect("/listings");
    })
}

module.exports.signup=async(req,res)=>{
    try{
        let {email,username,password}=req.body;
        let newuser=new user({email,username});
        let registereduser= await user.register(newuser,password);
        req.login(registereduser,((err)=>{
            if(err){
                return next(err);
            }   req.flash("success","Welcome to wanderlust");
            res.redirect("/listings");
        }))
     

    }catch(e){
        console.log(e);
        req.flash("error",e.message);
        res.redirect("/signup");
    }
        
}

module.exports.getlogin=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login= async(req,res)=>{
    req.flash("success","welcome to wanderlust , you are logged in");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}