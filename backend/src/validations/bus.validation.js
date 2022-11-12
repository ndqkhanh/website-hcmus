const Joi = require('joi');

const searchBus = {
  body: Joi.object().keys({
    startPoint: Joi.string().uuid().required(),
    endPoint: Joi.string().uuid().required(),
    page: Joi.number().required(),
    limit: Joi.number().required(),
    boId: Joi.string().uuid(),
    price: Joi.number(),
    type: Joi.number(),
  }),
};

const getBusInformation = {
  params: Joi.object().keys({
    busId: Joi.string().required(),
    // role: Joi.string(),
    // sortBy: Joi.string(),
    // limit: Joi.number().integer(),
    // page: Joi.number().integer(),
  }),
};

module.exports = {
  searchBus,
  getBusInformation,
};
