const catchAsync = require('../utils/catchAsync');
const { busService } = require('../services');

const searchBus = catchAsync(async (req, res) => {
  // const countQuestions = await userService.countMyQuestions(req);
  // const myQuestions = await userService.getMyQuestionsPagination(req);
  const busData = await busService.searchBus(req);
  res.send({ count: 1, data: [busData] });
});

const getBusInformation = catchAsync(async (req, res) => {
  // const countQuestions = await userService.countMyQuestions(req);
  // const myQuestions = await userService.getMyQuestionsPagination(req);
  const busInformation = await busService.getBusInformation(req);
  res.send({ data: busInformation });
});

module.exports = {
  searchBus,
  getBusInformation,
};
