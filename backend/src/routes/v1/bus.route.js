const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const busValidation = require('../../validations/bus.validation');
const busController = require('../../controllers/bus.controller');

const router = express.Router();

router.route('/search').post(validate(busValidation.searchBus), busController.searchBus);

router.route('/:busId').get(validate(busValidation.getBusInformation), busController.getBusInformation);

module.exports = router;
