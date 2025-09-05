const listing=require("./models/listing");
const review=require("./models/review");
const {listingschema,reviewschema}=require("./schema.js");
const Errorclass=require("./utli/Errorclass.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("Error","You must be logged into create listings!");
       return res.redirect("/login");
      }
      next();
}


module.exports.saveredirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}




module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let Listing=await listing.findById(id);
    console.log(Listing);
    if(!res.locals.curuser._id.equals(Listing.owner)){
      req.flash("Error","you 'don't have permission to edit");
       return res.redirect(`/listings/${id}`)
    }

next();
}



module.exports.listingValidate=(req,res,next)=>{
    let {error}= listingschema.validate(req.body);
    console.log(req.body);
  
    if(error){
       let errmsg=error.details.map((el)=>el.message).join(",")
      throw new Errorclass(400,errmsg)
    }
    else{
       next();
    }
  }

  module.exports.validatereview=(req,res,next)=>{
    let {error}= reviewschema.validate(req.body);
    console.log(error);
    if(error){
       let errmsg=error.details.map((el)=>el.message).join(",")
      throw new Errorclass(400,errmsg)
    }
    else{
       next();
    }
 }


 module.exports.isReviewAuthor=async(req,res,next)=>{
  let {id,reviewid}=req.params;
  let Review=await review.findById(reviewid);
  console.log(Review);
  if(!res.locals.curuser._id.equals(Review.author)){
    req.flash("Error","you are not author of this review");
     return res.redirect(`/listings/${id}`)
  }

next();
}