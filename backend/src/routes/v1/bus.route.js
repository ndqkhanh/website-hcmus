const express = require('express');
const validate = require('../../middlewares/validate');
const busValidation = require('../../validations/bus.validation');
const busController = require('../../controllers/bus.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.route('/search').post(validate(busValidation.searchBus), busController.searchBus);

router.route('/:busId').get(validate(busValidation.getBusInformation), busController.getBusInformation);

router.route('/clone').post(auth('cloneBus'), validate(busValidation.cloneBus), busController.cloneBus);
module.exports = router;
