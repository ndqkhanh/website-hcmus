/* eslint-disable prettier/prettier */
const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const ticketValidation = require('../../validations/ticket.validation');
const ticketController = require('../../controllers/ticket.controller');

const router = express.Router();

router
  .route('/create/:busId')
  .post(auth('createTicket'), validate(ticketValidation.createTicket), ticketController.createTicket);

router.route('/payment').post(auth('payTicket'), validate(ticketValidation.payTicket), ticketController.payTicket);

router.route('/printTicket').post(auth('printTicket'), validate(ticketValidation.printTicket), ticketController.printTicket);
router
  .route('/discard-ticket')
  .post(auth('discardTicket'), validate(ticketController.discardTicket), ticketController.discardTicket);
module.exports = router;
