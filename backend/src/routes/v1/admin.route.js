const express = require('express');
const validate = require('../../middlewares/validate');
const adminValidation = require('../../validations/admin.validation');
const adminController = require('../../controllers/admin.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/bus-ticket/create')
  .post(auth('createTicket'), validate(adminValidation.createBusTicket), adminController.createBusTicket);

router
  .route('/bus-ticket/delete/:ticketId')
  .post(auth('deleteTicket'), validate(adminValidation.deleteBusTicket), adminController.deleteBusTicket);
module.exports = router;
