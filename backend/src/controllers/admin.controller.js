const catchAsync = require('../utils/catchAsync');
const { adminService } = require('../services');

const createBus = catchAsync(async (req, res) => {
  const bus = await adminService.createBus(req);

  res.send(bus);
});

const deleteBus = catchAsync(async (req, res) => {
  await adminService.deleteBusById(req.params.busId);
  res.send({ success: true });
});

const updateBus = catchAsync(async (req, res) => {
  const busUpdated = await adminService.updateBus(req);
  res.send(busUpdated);
});

const getBus = catchAsync(async (req, res) => {
  const bus = await adminService.getBusById(req.params.busId);
  res.send(bus);
});

const busList = catchAsync(async (req, res) => {
  const { page, limit } = req.params;
  const buses = await adminService.busList(page, limit, req);
  res.send(buses);
});

const bookingList = catchAsync(async (req, res) => {
  const { page, limit } = req.params;
  const bookings = await adminService.bookingList(page, limit, req);
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
  createBus,
  deleteBus,
  updateBus,
  getBus,
  bookingList,
  bookingUpdate,
  bookingGet,
  busList,
};
