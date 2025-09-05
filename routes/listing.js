const express=require("express");
const router=express.Router();
const wrapAsync = require("../utli/wrapAsync.js");
const listing=require("../models/listing");
// const user=require("../models/user");
const {isLoggedIn,isOwner,listingValidate}=require("../middelware.js");
const listingcontroller=require("../controllers/listings.js")

const multer  = require('multer');
const{cloudinary,storage}=require("../cloudconfig.js");
const upload = multer({ storage });


//Listing validated
router.route("/")
.get( wrapAsync(listingcontroller.index))
.post(isLoggedIn, upload.single('listing[image]'),listingValidate,wrapAsync(listingcontroller.createlisting ));

//new route
router.get("/new",isLoggedIn,listingcontroller.renderNewForm)
router.get("/filter/:category", wrapAsync(listingcontroller.filterListings));
// Inside your router file (e.g., routes/listings.js)
router.get("/search", wrapAsync(listingcontroller.searchListings));
router.get("/suggestions", wrapAsync(listingcontroller.suggestListings));


router.route("/:id")
.get(wrapAsync(listingcontroller.showlistings))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),listingValidate,wrapAsync(listingcontroller.updatelisting))
.delete(isLoggedIn,isOwner,wrapAsync(listingcontroller.deletelistings));
// Route to filter listings by category (based on form input)



//edit route
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync( listingcontroller.renderEditform));

module.exports=router;


 