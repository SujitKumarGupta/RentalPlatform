const mongoose=require("mongoose");
let Schema=mongoose.Schema;
let Review=require("./review.js")

const listschema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    image:{
       url:String,
       filename:String,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    category: { // Added category field to represent the type of listing
        type: String,
        enum: ['Trending', 'Rooms', 'Iconic Cities', 'Mountains', 'Castles', 'Pools', 'Camping', 'Farms', 'Arctic', 'Ship', 'Snow'], // Allowed categories
        default: 'Trending', // Default value if no category is assigned
      },

    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }

})

listschema.post("findOneAndDelete",async(listing)=>{
    
    if(listing){
        await Review.deleteMany({_id: {$in:listing.reviews}});
    }

})

const listing=mongoose.model("listing",listschema);
module.exports=listing;