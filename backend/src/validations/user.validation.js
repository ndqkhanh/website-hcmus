const Joi = require('joi');

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().uuid().required(),
  }),
};

const updateUser = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    profilepictureurl: Joi.string().required(),
  }),
};
const getMyQuestions = {
  params: {
    page: Joi.number().required(),
    limit: Joi.number().required(),
  },
};

const getHistoryByUId = {
  params: {
    page: Joi.number().required(),
    limit: Joi.number().required(),
  },
};
module.exports = {
  getUsers,
  getUser,
  updateUser,
  getMyQuestions,
  getHistoryByUId,
};
