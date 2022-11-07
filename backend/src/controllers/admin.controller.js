const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { adminService } = require('../services');

const getMetrics = catchAsync(async (req, res) => {
  const metrics = await adminService.getAllMetrics();
  res.send(metrics);
});

const banUser = catchAsync(async (req, res) => {
  const user = await adminService.disableUser(req);
  res.send({ success: !!user });
});

const setConfiguration = catchAsync(async (req, res) => {
  const config = await adminService.setConfiguration(req);
  res.send({ success: !!config });
});

const getPendingQuestions = catchAsync(async (req, res) => {
  const result = await adminService.getPendingQuestions(req.params.page, req.params.limit);
  res.send(result);
});

const approveDeclineQuestion = catchAsync(async (req, res) => {
  const questionResult = await adminService.approveDeclineQuestion(req.body.questionId, req.body.status);
  res.send({ success: !!questionResult });
});

const getUsers = catchAsync(async (req, res) => {
  const result = await adminService.getUsers(req.params.page, req.params.limit);
  res.send(result);
});

const listConfigurations = catchAsync(async (req, res) => {
  const configuration = await adminService.listConfigurations();
  res.send(configuration);
});

module.exports = {
  getMetrics,
  banUser,
  getPendingQuestions,
  approveDeclineQuestion,
  getUsers,
  listConfigurations,
  setConfiguration,
};
