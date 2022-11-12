const catchAsync = require('../utils/catchAsync');
const { ticketService } = require('../services');

const createTicket = catchAsync(async (req, res) => {
  const result = await ticketService.createTicketByNumOfSeats(
    // req.user.id,
    'c118f693-8722-4461-a79d-d76991b96bcd',
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
