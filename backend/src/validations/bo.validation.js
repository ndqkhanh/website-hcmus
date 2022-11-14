/* eslint-disable prettier/prettier */
const Joi = require('joi');

const getReviews = {
  params: Joi.object().keys({
    boId: Joi.string().uuid().required(),
    page: Joi.number().required(),
    limit: Joi.number().required(),
  }),
};

const createReview = {
  params: Joi.object().keys({
    boId: Joi.string().uuid().required(),
  }),
  body: Joi.object().keys({
    rate: Joi.number().required(),
    comment: Joi.string().required(),
  }),
};

module.exports = {
  getReviews,
  createReview,
};
