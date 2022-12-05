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

router
  .route('/bus-ticket/update/:ticketId')
  .post(auth('updateTicket'), validate(adminValidation.updateTicket), adminController.updateTicket);

router.route('/bus/list/:page/:limit').get(auth('busList'), validate(adminValidation.busList), adminController.busList);
router
  .route('/booking/list/:page/:limit')
  .get(auth('bookingList'), validate(adminValidation.bookingList), adminController.bookingList);

router
  .route('/booking/:bid')
  .get(auth('bookingGet'), validate(adminValidation.bookingGet), adminController.bookingGet)
  .post(auth('bookingUpdate'), validate(adminValidation.bookingUpdate), adminController.bookingUpdate);

module.exports = router;
