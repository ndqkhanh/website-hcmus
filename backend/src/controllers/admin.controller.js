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

const updateTicket = catchAsync(async (req, res) => {
  const ticketUpdated = await adminService.updateTicket(req);
  res.send(ticketUpdated);
});

const busList = catchAsync(async (req, res) => {
  const { page, limit } = req.params;
  const buses = await adminService.busList(page, limit);
  res.send(buses);
});

const bookingList = catchAsync(async (req, res) => {
  const { page, limit } = req.params;
  const bookings = await adminService.bookingList(page, limit);
  res.send(bookings);
});

const bookingUpdate = catchAsync(async (req, res) => {
  const booking = await adminService.bookingUpdate(req);
  res.send(booking);
});

const bookingGet = catchAsync(async (req, res) => {
  const booking = await adminService.bookingGet(req.params.bid);
  res.send(booking);
});

module.exports = {
  createBusTicket,
  deleteBusTicket,
  updateTicket,
  bookingList,
  bookingUpdate,
  bookingGet,
  busList,
};
