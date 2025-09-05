const listing=require("../models/listing");
const Review=require("../models/review");

module.exports.createreview=async(req,res)=>{
    console.log(req.body.review)
    const listings=await listing.findById(req.params.id);
    let newreview=new Review(req.body.review);
    newreview.author=req.user._id;
    console.log(newreview);
     listings.reviews.push(newreview);
     await newreview.save();
     await listings.save();
     req.flash("success","New Review Created!");
     res.redirect(`/listings/${listings._id}`)
   } 

   module.exports.deletereview=async(req,res)=>{
    let {id,reviewid}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}})
    await Review.findByIdAndDelete(reviewid);
 console.log("sucessful deleted");
 req.flash("success","Review Deleted!");
 
    res.redirect(`/listings/${id}`);
   };