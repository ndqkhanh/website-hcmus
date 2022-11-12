const Joi = require('joi');

const searchBus = {
  body: Joi.object().keys({
    status: Joi.boolean().required(),
  }),
};

const getBusInformation = {
  query: Joi.object().keys({
    busId: Joi.string().uuid().required(),
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
