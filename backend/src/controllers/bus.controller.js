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

const cloneBus = catchAsync(async (req, res) => {
  const newBus = await busService.cloneBus(req.body.id, req.body.start_time, req.body.end_time);
  res.send(newBus);
});
module.exports = {
  searchBus,
  getBusInformation,
  cloneBus,
};
