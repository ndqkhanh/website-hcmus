const { PrismaClient } = require('@prisma/client');
const httpStatus = require('http-status');

const prisma = new PrismaClient();
const ApiError = require('../utils/ApiError');

const createBusTicket = async (req) => {
  const bus = await prisma.buses.findUnique({
    where: {
      id: req.body.bus_id,
    },
  });
  if (!bus) {
    throw new ApiError(httpStatus.NOT_FOUND, 'This bus_id does not exist');
  }

  const user = await prisma.users.findUnique({
    where: {
      id: req.body.user_id,
    },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'This user id does not exist');
  }

  const BookedTickets = await prisma.bus_tickets.findMany({
    where: {
      bus_id: req.body.bus_id,
    },
  });

  BookedTickets.forEach((ticket) => {
    if (ticket.seat === req.body.seat && ticket.status !== 2) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'This seat is already booked');
    }
  });
  if (BookedTickets.length >= bus.num_of_seats) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'There is no seats left');
  }
  return prisma.bus_tickets.create({
    data: {
      bus_id: req.body.bus_id,
      user_id: req.body.user_id,
      name: req.body.name,
      phone: req.body.phone,
      seat: req.body.seat,
      status: req.body.status,
    },
  });
};

const deleteBusTicketById = async (ticketId) => {
  const ticket = await prisma.bus_tickets.findUnique({
    where: {
      id: ticketId,
    },
  });

  if (!ticket) {
    throw new ApiError(httpStatus.NOT_FOUND, 'This ticket does not exist');
  }

  return prisma.bus_tickets.delete({
    where: {
      id: ticketId,
    },
  });
};

const updateTicket = async (req) => {
  const checkTicketExist = await prisma.bus_tickets.findUnique({
    where: {
      id: req.params.ticketId,
    },
  });

  if (!checkTicketExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'This ticket does not exist');
  }

  const ticketUpdated = await prisma.bus_tickets.update({
    where: {
      id: req.params.ticketId,
    },
    data: {
      bus_id: req.body.bus_id,
      user_id: req.body.user_id,
      name: req.body.name,
      phone: req.body.phone,
      seat: req.body.seat,
      status: req.body.status,
    },
  });

  return ticketUpdated;
};

const bookingList = async (page, limit) => {
  const data = await prisma.bus_tickets.findMany({
    skip: page * limit,
    take: limit,
    include: {
      buses: {
        include: {
          bus_operators: true,
        },
      },
      users: {
        select: {
          email: true,
        },
      },
    },
  });

  return { data };
};

const bookingUpdate = async (req) => {
  const checkTicketExist = await prisma.bus_tickets.findUnique({
    where: {
      id: req.params.bid,
    },
  });

  if (!checkTicketExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'This ticket does not exist');
  }

  const ticketUpdated = await prisma.bus_tickets.update({
    where: {
      id: req.params.bid,
    },
    data: {
      status: req.body.status,
      name: req.body.name,
      phone: req.body.phone,
      seat: req.body.seat,
    },
  });

  return ticketUpdated;
};

const bookingGet = async (bid) => {
  const ticket = await prisma.bus_tickets.findUnique({
    where: {
      id: bid,
    },
    include: {
      buses: {
        include: {
          bus_stations_bus_stationsTobuses_start_point: true,
          bus_stations_bus_stationsTobuses_end_point: true,
        },
      },
      users: {
        select: {
          email: true,
        },
      },
    },
  });

  if (!ticket) {
    throw new ApiError(httpStatus.NOT_FOUND, 'This ticket does not exist');
  }

  return ticket;
};
module.exports = {
  createBusTicket,
  deleteBusTicketById,
  updateTicket,
  bookingList,
  bookingUpdate,
  bookingGet,
};
