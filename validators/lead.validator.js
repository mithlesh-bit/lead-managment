// Joi validator is used to provide proper error responses,
// because Mongoose does not return well-formatted error messages.

const Joi = require("joi");

const leadValidation = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  email: Joi.string().email().required(),
  source: Joi.string()
    .valid("website", "referral", "social", "ads", "other")
    .required(),
  isDeleted: Joi.boolean().default(false),
});

module.exports = leadValidation;
