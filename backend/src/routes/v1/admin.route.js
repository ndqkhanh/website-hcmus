const express = require('express');
const validate = require('../../middlewares/validate');
const adminValidation = require('../../validations/admin.validation');
const adminController = require('../../controllers/admin.controller');
const auth = require('../../middlewares/auth');
const { adminService } = require('../../services');

const router = express.Router();

router.route('/metrics').get(auth('getMetrics'), adminController.getMetrics);

router.route('/ban-user/:userId').post(auth('banUser'), validate(adminValidation.banUser), adminController.banUser);

router
  .route('/set-configuration/:slug')
  .post(auth('setConfiguration'), validate(adminValidation.setConfiguration), adminController.setConfiguration);

router
  .route('/manage-questions')
  .post(
    auth('approveDeclineQuestion'),
    validate(adminValidation.approveDeclineQuestion),
    adminController.approveDeclineQuestion
  );

router
  .route('/manage-questions/:page/:limit')
  .get(auth('getPendingQuestions'), validate(adminValidation.getPendingQuestions), adminController.getPendingQuestions);

router.route('/list-users/:page/:limit').get(auth('getUsers'), validate(adminValidation.getUsers), adminController.getUsers);

router.route('/list-configuration').get(auth('listConfigurations'), adminController.listConfigurations);

module.exports = router;
