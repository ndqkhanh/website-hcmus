const Joi = require('joi').extend(require('@joi/date'));

const searchBus = {
  body: Joi.object().keys({
    startPoint: Joi.string().uuid().required(),
    endPoint: Joi.string().uuid().required(),
    page: Joi.number().required(),
    limit: Joi.number().required(),
    boId: Joi.string().uuid(),
    price: Joi.number(),
    type: Joi.number(),
    startTime: Joi.date().required(),
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

const cloneBus = {
  body: Joi.object().keys({
    id: Joi.string().uuid().required(),
    start_time: Joi.date().format(['YYYY/MM/DD']).required(),
    end_time: Joi.date().format(['YYYY/MM/DD']).required(),
  }),
};
module.exports = {
  searchBus,
  getBusInformation,
  cloneBus,
};
