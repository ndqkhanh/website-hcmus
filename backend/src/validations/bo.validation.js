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

const getBO = {
  params: Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
  }),
};
const createBO = {
  body: Joi.object().keys({
    image_url: Joi.string().required(),
    phone: Joi.string().required(),
    name: Joi.string().required(),
  }),
};
const updateBO = {
  body: Joi.object().keys({
    id: Joi.string().required(),
    image_url: Joi.string().required(),
    phone: Joi.string().required(),
    name: Joi.string().required(),
  }),
};
const deleteBO = {
  body: Joi.object().keys({
    id: Joi.string().required(),
  }),
};
const getBOByID = {
  params: Joi.object().keys({
    boId: Joi.string().uuid().required(),
  }),
};
module.exports = {
  getBOByID,
  deleteBO,
  updateBO,
  createBO,
  getBO,
  getReviews,
  createReview,
};
