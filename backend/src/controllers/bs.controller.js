/* eslint-disable prettier/prettier */
const catchAsync = require('../utils/catchAsync');
const { bsService } = require('../services');

const getBusStations = catchAsync(async (req, res) => {
  const result = await bsService.getBusStations();
  res.send(result);
});

module.exports = {
  getBusStations,
};
