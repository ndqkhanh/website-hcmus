/* eslint-disable prettier/prettier */
const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const boValidation = require('../../validations/bo.validation');
const boController = require('../../controllers/bo.controller');

const router = express.Router();

router.route('/review/:boId/:page/:limit').get(validate(boValidation.getReviews), boController.getReviews);

router
  .route('/review/create/:boId')
  .post(auth('createReview'), validate(boValidation.createReview), boController.createReview);
router.route('/list/:page/:limit').get(validate(boValidation.getBO), boController.viewBO);
router.route('/create').post(auth('createBO'), validate(boValidation.createBO), boController.createBO);
router.route('/update').post(auth('updateBO'), validate(boValidation.updateBO), boController.updateBO);
router.route('/delete').post(auth('deteleBO'), validate(boValidation.deleteBO), boController.deleteBO);
router.route('/:boId').get(auth('getBOByID'), validate(boValidation.getBOByID), boController.getBOById);

module.exports = router;
