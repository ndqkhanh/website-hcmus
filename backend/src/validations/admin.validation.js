const Joi = require('joi');
const { status } = require('./custom.validation');

const banUser = {
  params: Joi.object().keys({
    userId: Joi.string().uuid().required(),
  }),
  body: Joi.object().keys({
    status: Joi.boolean().required(),
  }),
};

const setConfiguration = {
  params: Joi.object().keys({
    slug: Joi.string().required(),
  }),
  body: Joi.object().keys({
    value: Joi.string(),
  }),
};

const getPendingQuestions = {
  params: Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
  }),
};

const approveDeclineQuestion = {
  body: Joi.object().keys({
    questionId: Joi.string().uuid().required(),
    status: Joi.number().required().custom(status),
  }),
};

const getUsers = {
  params: Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
  }),
};

module.exports = {
  banUser,
  setConfiguration,
  getPendingQuestions,
  approveDeclineQuestion,
  getUsers,
};
