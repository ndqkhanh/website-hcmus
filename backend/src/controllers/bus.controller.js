const catchAsync = require('../utils/catchAsync');
const { busService } = require('../services');

const searchBus = catchAsync(async (req, res) => {
  // const countQuestions = await userService.countMyQuestions(req);
  // const myQuestions = await userService.getMyQuestionsPagination(req);
  const busData = await busService.searchBus(req.body);
  res.send(busData);
});

const getBusInformation = catchAsync(async (req, res) => {
  const busInformation = await busService.getBusInformation(req.params.busId);
  res.send(busInformation);
});

module.exports = {
  searchBus,
  getBusInformation,
};
