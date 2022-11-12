/* eslint-disable prettier/prettier */
const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const ticketValidation = require('../../validations/ticket.validation');
const ticketController = require('../../controllers/ticket.controller');

const router = express.Router();

router.route('/create').post(auth('createTicket'), validate(ticketValidation.createTicket), ticketController.createTicket);
router.route('/print').post(auth('printTicket'), validate(ticketValidation.printTicket), ticketController.createTicket);

module.exports = router;
