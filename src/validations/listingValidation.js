const Joi = require('joi');


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


const SUBMIT_REQUIRED_FIELDS = ['title', 'description', 'price', 'location', 'listing_type', 'listing_image_main'];

const submitListingSchema = createListingSchema.fork(SUBMIT_REQUIRED_FIELDS, field => field.required());

const rejectListingSchema = Joi.object({
    reason: Joi.string().trim().min(10).max(1000).required().messages({
        'string.min': 'Rejection reason must be at least 10 characters long',
        'string.empty': 'Rejection reason is required',
        'any.required': 'Rejection reason is required'
    })
});

const searchListingsSchema = Joi.object({
    q: Joi.string().trim().max(100),
    location: Joi.string().trim().max(255),
    listing_type: Joi.string().valid('apartment', 'hostel'),
    min_price: Joi.number().min(0),
    max_price: Joi.number().min(0).when('min_price', {
        is: Joi.exist(),
        then: Joi.number().min(Joi.ref('min_price'))
    }).messages({
        'number.min': 'max_price must be greater than or equal to min_price'
    }),
    bedrooms: Joi.number().integer().min(0).max(50),
    flatmate: Joi.string().valid('male', 'female', 'any'),
    size: Joi.string().valid('moderate', 'large'),
    sort: Joi.string().valid('newest', 'price_asc', 'price_desc').default('newest'),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(12)
});

module.exports = {
    createListingSchema,
    updateListingSchema,
    submitListingSchema,
    rejectListingSchema,
    searchListingsSchema
}