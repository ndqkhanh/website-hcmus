const httpStatus = require('http-status');

/* eslint-disable prettier/prettier */
const catchAsync = require('../utils/catchAsync');
const { ticketService, busService, userService, busStationService, busOperatorService } = require('../services');
const ApiError = require('../utils/ApiError');

const createTicket = catchAsync(async (req, res) => {
  const result = await ticketService.createTicketByNumOfSeats(
    req.user.email,
    req.user.id,
    req.params.busId,
    req.body.name,
    req.body.phone,
    req.body.numOfSeats
  );
  res.send(result);
});

const payTicket = catchAsync(async (req, res) => {
  const result = await ticketService.payTicket(req.body.ticket_ids);
  res.send(result);
});

const printTicket = catchAsync(async (req, res) => {
  const tickets = await ticketService.getTicketByBusIdAndUserId(req.body.bus_id, req.body.user_id);
  if (tickets.length <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This ticket does not exist');
  }

  const bus = await busService.getBusById(req.body.bus_id);
  if (!bus) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This bus does not exist');
  }

  const busOperator = await busOperatorService.getBusOperatorById(bus.bo_id);
  const user = await userService.getUserById(req.body.user_id);

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This user does not exist');
  }

  const startPoint = await busStationService.getBusStationById(bus.start_point);
  const endPoint = await busStationService.getBusStationById(bus.end_point);
  const seats = [];
  tickets.forEach((ticket) => {
    seats.push(ticket.seat);
  });
  const ticketInfo = {
    fullName: tickets[0].name,
    ticketId: tickets,
    startPoint,
    startTime: bus.start_time,
    numsOfSeat: tickets.length,
    ticketCost: bus.price,
    status: 2,
    busOperator: busOperator.name,
    endPoint,
    seats,
    endTime: bus.end_time,
    policy: bus.policy,
    type: bus.type,
    totalCost: bus.price * tickets.length,
  };
  res.send(ticketInfo);
});

const discardTicket = catchAsync(async (req, res) => {
  const result = await ticketService.discardTicket(req);
  res.send(result);
});
module.exports = {
  discardTicket,
  createTicket,
  printTicket,
  payTicket,
};
