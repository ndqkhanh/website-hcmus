/* eslint-disable prettier/prettier */
const catchAsync = require('../utils/catchAsync');
const { ticketService } = require('../services');

const createTicket = catchAsync(async (req, res) => {
  const result = await ticketService.createTicketByNumOfSeats(
    req.user.id,
    req.params.busId,
    req.body.name,
    req.body.phone,
    req.body.numOfSeats
  );
  res.send(result);
});

module.exports = {
  createTicket,
};
