const Joi = require('joi');

const schema = Joi.object({
  title: Joi.string(),
  description: Joi.array().items(Joi.string()).required(),
  image: Joi.string().required(),
  url: Joi.string(),
  datePublished: Joi.date().iso().required(),
  dateModified: Joi.date().iso().required(),
});

module.exports = schema;
