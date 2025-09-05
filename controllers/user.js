
const User=require("../models/user");

module.exports.renderSignuppage=(req,res)=>{
    res.render("users/signup.ejs");
 }


module.exports.signup=async(req,res,next)=>{
    try{
       let {username,email,password}=req.body;
       const newuser= new User({username,email});
       const registereduser=await User.register(newuser,password);
       console.log(registereduser);
       req.login(registereduser,(err)=>{
          if(err){
             next(err);
          }        
       req.flash("success","Welcome to WanderHome");
       res.redirect("/listings");
       })
    }
    catch(e){
       req.flash("Error", e.message);
       res.redirect("/signup");
    }     
 }


 module.exports.rederLoginpage=(req,res)=>{
    res.render("users/login.ejs")
 };

 module.exports.login=async(req,res)=>{
    try{
       req.flash( "success", "welcome back to wanderlust !");
       let redirecturl=res.locals.redirectUrl  || "/listings"
       res.redirect(redirecturl);
    } 
    catch(err){
    req.flash("Error",err.message);
    
    }
    }

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
       if(err){
          next(err);
       }
       req.flash("success","you are logged out!");
       res.redirect("/listings")
    })
 }