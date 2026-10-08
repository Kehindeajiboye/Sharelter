const Joi = require('joi');

// Every field is optional while the listing is a draft.
// Required fields are checked when the listing is submitted (Step 6).
const listingFields = {
    title: Joi.string().trim().min(5).max(150).messages({
        'string.min': 'Title must be at least 5 characters long',
        'string.max': 'Title must be at most 150 characters long'
    }),
    description: Joi.string().trim().min(20).max(5000).messages({
        'string.min': 'Description must be at least 20 characters long',
        'string.max': 'Description must be at most 5000 characters long'
    }),
    price: Joi.number().positive().precision(2).max(9999999999.99).messages({
        'number.base': 'Price must be a number',
        'number.positive': 'Price must be greater than 0'
    }),
    location: Joi.string().trim().min(2).max(255),
    listing_type: Joi.string().valid('apartment', 'hostel').messages({
        'any.only': 'Listing type must be apartment or hostel'
    }),
    listing_image_main: Joi.string().uri({ scheme: ['http', 'https'] }).messages({
        'string.uri': 'Main image must be a valid URL',
        'string.uriCustomScheme': 'Main image must be an http or https URL'
    }),
    listing_images: Joi.array().items(Joi.string().uri({ scheme: ['http', 'https'] })).max(20).messages({
        'array.max': 'A listing can have at most 20 images'
    }),
    bedroom: Joi.number().integer().min(0).max(50),
    kitchen: Joi.number().integer().min(0).max(20),
    flatmate: Joi.string().valid('male', 'female', 'any'),
    size: Joi.string().valid('moderate', 'large'),
    listing_status: Joi.string().valid('available', 'not available')
};

const createListingSchema = Joi.object(listingFields);

const updateListingSchema = Joi.object(listingFields).min(1).messages({
    'object.min': 'Provide at least one field to update'
});

module.exports = {
    createListingSchema,
    updateListingSchema
}