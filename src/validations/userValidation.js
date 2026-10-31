const Joi = require('joi');

const updateUserSchema = Joi.object({
    first_name: Joi.string().min(3).max(100).optional().messages({
        'string.base': 'First name must be a string',
        'string.min': 'First name must be at least 3 characters long',
        'string.max': 'First name must be at most 100 characters long',
    }),
    last_name: Joi.string().min(3).max(100).optional().messages({
        'string.base': 'Last name must be a string',
        'string.min': 'Last name must be at least 3 characters long',
        'string.max': 'Last name must be at most 100 characters long',
    }),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ng"] }    }).optional().messages({
         "string.email": "Email must be a valid email address",
    }),
    
    phone: Joi.string().pattern(/^[0-9]{10}$/).optional().messages({
        'string.max': 'Phone number must be at most 15 characters long',
    }),
});

module.exports = {
    updateUserSchema,
};