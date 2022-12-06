const Joi = require('joi');

const createBus = {
  body: Joi.object().keys({
    bo_id: Joi.string().uuid().required(),
    start_point: Joi.string().uuid().required(),
    end_point: Joi.string().required(),
    type: Joi.number().required(),
    start_time: Joi.date().required(),
    end_time: Joi.date().required(),
    image_url: Joi.string().required(),
    policy: Joi.string(),
    num_of_seats: Joi.number().required(),
    price: Joi.number().required(),
  }),
};

const deleteBus = {
  params: Joi.object().keys({
    busId: Joi.string().uuid().required(),
  }),
};

const updateBus = {
  params: Joi.object().keys({
    busId: Joi.string().uuid().required(),
  }),
  body: Joi.object().keys({
    bo_id: Joi.string().uuid().required(),
    start_point: Joi.string().uuid().required(),
    end_point: Joi.string().required(),
    type: Joi.number().required(),
    start_time: Joi.date().required(),
    end_time: Joi.date().required(),
    image_url: Joi.string().required(),
    policy: Joi.string(),
    num_of_seats: Joi.number().required(),
    price: Joi.number().required(),
  }),
};

const getBus = {
  params: Joi.object().keys({
    busId: Joi.string().uuid().required(),
  }),
};
const busList = {
  params: Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
  }),
};
const bookingList = {
  params: Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
  }),
};

const bookingUpdate = {
  params: Joi.object().keys({
    bid: Joi.string().uuid().required(),
  }),
  body: Joi.object().keys({
    status: Joi.number().required(),
    name: Joi.string().required(),
    phone: Joi.string().required(),
    seat: Joi.string().required(),
  }),
};

const bookingGet = {
  params: Joi.object().keys({
    bid: Joi.string().uuid().required(),
  }),
};

module.exports = {
  createBus,
  deleteBus,
  updateBus,
  getBus,
  bookingList,
  bookingUpdate,
  bookingGet,
  busList,
};
