const Joi = require('joi');

const createBusTicket = {
  body: Joi.object().keys({
    bus_id: Joi.string().uuid().required(),
    user_id: Joi.string().uuid().required(),
    name: Joi.string().required(),
    phone: Joi.string().required(),
    seat: Joi.string().required(),
    status: Joi.number().required(),
  }),
};

module.exports = {
  createBusTicket,
};
