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

const deleteBusTicket = {
  params: Joi.object().keys({
    ticketId: Joi.string().uuid().required(),
  }),
};

const updateTicket = {
  params: Joi.object().keys({
    ticketId: Joi.string().uuid().required(),
  }),
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
  deleteBusTicket,
  updateTicket,
};
