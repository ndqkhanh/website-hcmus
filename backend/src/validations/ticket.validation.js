/* eslint-disable prettier/prettier */
const Joi = require('joi');

const createTicket = {
  params: Joi.object().keys({
    busId: Joi.string().uuid().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    numOfSeats: Joi.number().required(),
  }),
};

module.exports = {
  createTicket,
};
