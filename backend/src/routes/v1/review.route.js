/* eslint-disable prettier/prettier */
const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const boValidation = require('../../validations/review.validation');
const boController = require('../../controllers/review.controller');

const router = express.Router();

router.route('/review/:boId/:page/:limit').get(validate(boValidation.getReviews), boController.getReviews);

router
  .route('/review/create/:boId')
  .post(auth('createReview'), validate(boValidation.createReview), boController.createReview);

module.exports = router;
