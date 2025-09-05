const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utli/wrapAsync");
const Errorclass=require("../utli/Errorclass.js");
const passport=require("passport");
const {saveredirectUrl}=require("../middelware.js");

const usercontroller=require("../controllers/user.js");



router.route("/signup")
.get(usercontroller.renderSignuppage)
.post(wrapAsync(usercontroller.signup));



router.route("/login")
.get(usercontroller.rederLoginpage)
.post(saveredirectUrl, passport.authenticate("local",{failureRedirect:"/login", failureFlash:true} ),wrapAsync(usercontroller.login));

///logout
router.get("/logout",usercontroller.logout);

module.exports=router;
