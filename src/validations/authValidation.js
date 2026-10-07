const Joi = require('joi');

const signupSchema = Joi.object({
    first_name: Joi.string().min(3).max(100).required().messages({
        'string.base': 'First name must be a string',
        'string.empty': 'First name is required',
        'string.min': 'First name must be at least 3 characters long',
        'string.max': 'First name must be at most 100 characters long',
        'any.required': 'First name is required'
    }),
    last_name: Joi.string().min(3).max(100).required().messages({
        'string.base': 'Last name must be a string',
        'string.empty': 'Last name is required',
        'string.min': 'Last name must be at least 3 characters long',
        'string.max': 'Last name must be at most 100 characters long',
        'any.required': 'Last name is required'
    }),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ng"] } }).required().messages({
        "string.email": "Email must be a valid email address",
        "string.empty": "Email is required",
        "any.required": "Email is required"
    }),
    phone: Joi.string().max(15).required().messages({
        'string.empty': 'Phone number is required',
        'string.max': 'Phone number must be at most 15 characters long',
        'any.required': 'Phone number is required'
    }),
    password: Joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@$%&*])")).min(8).required().messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@$%&*)',
        'string.min': 'Password must be at least 8 characters long',
        'string.empty': 'Password is required',
    })
})

const loginSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ng"] } }).required().messages({
        "string.email": "Email must be a valid email address",
        "string.empty": "Email is required",
        "any.required": "Email is required"
    }),
    password: Joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@$%&*])")).min(8).required().messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@$%&*)',
        'string.min': 'Password must be at least 8 characters long',
        'string.empty': 'Password is required',
    })
})

module.exports = {
    signupSchema,
    loginSchema
}