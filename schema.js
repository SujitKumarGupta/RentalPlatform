const Joi=require("joi");


module.exports.listingschema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
    description: Joi.string().required(), // Corrected typo from 'descripition' to 'description'
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.string().allow("", null),
        price: Joi.number().required().min(0),
        category: Joi.string().valid(
            'Trending', 
            'Rooms', 
            'Iconic Cities', 
            'Mountains', 
            'Castles', 
            'Pools', 
            'Camping', 
            'Farms', 
            'Arctic', 
            'Ship', 
            'Snow'
        ).default('Trending') // Default to 'Trending' if no category is provided
    }).required(),
});


module.exports.reviewschema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required()
})