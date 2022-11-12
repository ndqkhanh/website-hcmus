const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, testService, userService, tokenService, emailService } = require('../services');

const resetPassword = catchAsync(async (req, res) => {
  const busStation = await testService.resetPassword(req.body.id, req.body.name);
  res.send({ id: busStation.id, name: busStation.name });
});

module.exports = {
  resetPassword,
};
