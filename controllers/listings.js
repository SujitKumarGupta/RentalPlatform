
const listing=require("../models/listing");

module.exports.index= async (req,res)=>{
    const alllisting=await listing.find({});
    res.render("listing/index",{alllisting})
   }


module.exports.renderNewForm=(req,res)=>{
    console.log(req.user)
    res.render("listing/new.ejs")
   }



   module.exports.showlistings=async (req,res)=>{
    let {id}=req.params;
    let listings= await listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");

    if(! listings){
      req.flash("Error","Listings you requested for  does not Exist!");
      res.redirect("/listings")
    }
    res.render("listing/show.ejs",{listings})
   }


   module.exports.createlisting=async (req,res,next)=>{
    const neWListing=new listing(req.body.listing);
    let url=req.file.path;
    let filename=req.file.filename;

    neWListing.image={filename,url};
    neWListing.owner=req.user._id;
    await neWListing.save();
    req.flash("success","New Listing  Created!");
    res.redirect("/listings")
   }
   
  // filter option 
   module.exports.filterListings = async (req, res) => {
    const { category } = req.params;
    try {
      const filteredListings = await listing.find({ category });
      if (!filteredListings || filteredListings.length === 0) {
        req.flash("success", "No listings found for the selected category.");
        return res.redirect("/listings");
      }
      res.render("listing/index.ejs", { alllisting: filteredListings});
    } catch (err) {
      console.error("Error fetching filtered listings:", err);
      req.flash("error", "An error occurred while filtering listings.");
      res.redirect("/listings");
    }
  };
 

  //Search option 
  module.exports.searchListings = async (req, res) => {
    const { query } = req.query;
    try {
      // Initialize search query object
      let searchQuery = {};
      // If the user has entered a title, search by title (case-insensitive)
      if (query) {
        searchQuery.$or = [
          { title: { $regex: query, $options: "i" } },  // Match title (case-insensitive)
          { location: { $regex: query, $options: "i" } }, // Match location (case-insensitive)
          { country: { $regex: query, $options: "i" } }, // Match country (case-insensitive)
          { descripition: { $regex: query, $options: "i" } }, // Match description (case-insensitive)
          { category: { $regex: query, $options: "i" } },// Match category (case-insensitive)
          
        ];
      }
      // Fetch the listings based on the dynamic search query
      const listings = await listing.find(searchQuery);
      // If no listings found, show a message
      if (!listings || listings.length === 0) {
        req.flash("success", `No results found for "${query}".`);
        return res.redirect("/listings");
      }
      // If listings are found, render the results page
      res.render("listing/index", { alllisting: listings, query: req.query });
    } catch (err) {
      console.error("Error during search:", err);
      req.flash("error", "An error occurred while performing the search.");
      res.redirect("/listings");
    }
  };
  
  // // In listingcontroller.js
  // module.exports.searchListings = async (req, res) => {
  //   const { query } = req.query;
  
  //   try {
  //     // Initialize search query object
  //     let searchQuery = {};
  
  //     if (query) {
  //       searchQuery.$or = [
  //         { title: { $regex: query, $options: "i" } },
  //         { location: { $regex: query, $options: "i" } },
  //         { country: { $regex: query, $options: "i" } },
  //         { descripition: { $regex: query, $options: "i" } }, // Fixed typo here
  //         { category: { $regex: query, $options: "i" } },
  //       ];
  //     }

  //     // Handle AJAX requests
  //     if (req.xhr) {
  //       const suggestions = await listing.find(searchQuery).limit(10);
  //       console.log("Suggestions JSON:", suggestions);
  //       res.json(suggestions);  // Return suggestions as JSON
  //     }
  
  //     // Handle full-page requests
  //     const listings = await listing.find(searchQuery).limit(10); // Added limit here
  
  //     if (!listings || listings.length === 0) {
  //       req.flash("success", `No results found for "${query}".`);
  //       return res.redirect("/listings");
  //     }
  
  //     res.render("listing/index", { alllisting: listings, query: req.query });
  //   } catch (err) {
  //     console.error("Error during search:", err);
  //     req.flash("error", "An error occurred while performing the search.");
  //     res.redirect("/listings");
  //   }
  // };
  


  module.exports.suggestListings = async (req, res) => {
    const { query } = req.query;
  
    try {
      // If no query is provided, return an empty array as a fallback
      if (!query) {
        return res.json([]);
      }
  
      // Escape special characters in the query for regex
      const escapedQuery = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  
      // Create a regex for flexible partial matching
      const regexQuery = new RegExp(escapedQuery, "i");
  
      // Initialize the search query object
      let searchQuery = {
        $or: [
          { title: regexQuery },        // Match title
          { location: regexQuery },     // Match location
          { country: regexQuery },      // Match country
          { descripition: regexQuery }, // Match description
          { category: regexQuery }      // Match category
        ]
      };
  
      // Fetch suggestions based on the search query
      const suggestions = await listing
        .find(searchQuery)
        .limit(10) // Limit to the top 5 suggestions
        .sort({ title: 1 }) // Optional: Sort by title alphabetically
        .lean();
  
      // If no suggestions are found, return an appropriate message
      if (!suggestions.length) {
        return res.json({ message: "No suggestions found." });
      }
  
      res.json(suggestions); // Return the suggestions as JSON
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

//editing the form
module.exports.renderEditform=async (req,res)=>{
    let {id}=req.params;
    let listings=await listing.findById(id);
    

    if(!listings){
      req.flash("Error","Listings you requested for  does not Exist!");
      res.redirect("/listings")
    }
    listingsImageUrl=listings.image.url;
    originalImageurl=listingsImageUrl.replace("/upload","/upload/h_200,w_250");
    console.log(originalImageurl);
    res.render("listing/edit.ejs",{listings,originalImageurl});
   }

//updating the form
   module.exports.updatelisting=async (req,res)=>{
    let {id}=req.params;
   

    let listings=await listing.findByIdAndUpdate(id, { ...req.body.listing})

    if(typeof req.file !=="undefined"){
      let url=req.file.path;
      console.log(url)
      let filename=req.file.filename;
  
      listings.image={filename,url}
    await listings.save();

    }
    

    req.flash("success","Listing updated!")
    res.redirect("/listings")  
   }

   //deleteing the form 

   module.exports.deletelistings= async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success"," Listing  Deleted!");
    res.redirect("/listings")
   }