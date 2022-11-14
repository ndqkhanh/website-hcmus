const catchAsync = require('../utils/catchAsync');
const { adminService } = require('../services');

const createBusTicket = catchAsync(async (req, res) => {
  const ticket = await adminService.createBusTicket(req);

  res.send(ticket);
});

module.exports = {
  createBusTicket,
};
