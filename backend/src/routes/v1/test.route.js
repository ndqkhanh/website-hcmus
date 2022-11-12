const express = require('express');
const validate = require('../../middlewares/validate');
const testValidation = require('../../validations/test.validation');
const testController = require('../../controllers/test.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/test', validate(testValidation.resetPassword), testController.resetPassword);

module.exports = router;
