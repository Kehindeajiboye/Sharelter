const Joi = require('joi');

const reportSchema = Joi.object({
    description: Joi.string().max(1000),
    type: Joi.string().required()
});

module.exports = { reportSchema };