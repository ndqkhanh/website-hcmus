const catchAsync = require('../utils/catchAsync');
const { adminService } = require('../services');

const createBusTicket = catchAsync(async (req, res) => {
  const ticket = await adminService.createBusTicket(req);

  res.send(ticket);
});

const deleteBusTicket = catchAsync(async (req, res) => {
  await adminService.deleteBusTicketById(req.params.ticketId);
  res.send({ success: true });
});
module.exports = {
  createBusTicket,
  deleteBusTicket,
};
