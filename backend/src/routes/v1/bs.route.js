/* eslint-disable prettier/prettier */
const express = require('express');
const bsController = require('../../controllers/bs.controller');

const router = express.Router();

router.route('/list').get(bsController.getBusStations);

module.exports = router;
