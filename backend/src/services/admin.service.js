const { PrismaClient } = require('@prisma/client');
const httpStatus = require('http-status');
const { email } = require('../config/config');

const prisma = new PrismaClient();
const ApiError = require('../utils/ApiError');

const createBus = async (req) => {
  return prisma.buses.create({
    data: {
      bo_id: req.body.bo_id,
      start_point: req.body.start_point,
      end_point: req.body.end_point,
      type: req.body.type,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      image_url: req.body.image_url,
      policy: req.body.policy,
      num_of_seats: req.body.num_of_seats,
      price: req.body.price,
    },
  });
};

const deleteBusById = async (busId) => {
  await prisma.buses.delete({
    where: {
      id: busId,
    },
  });
  return true;
};

const updateBus = async (req) => {
  const checkBusExist = await prisma.buses.findUnique({
    where: {
      id: req.params.busId,
    },
  });

  if (!checkBusExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'This ticket does not exist');
  }

  const busUpdated = await prisma.buses.update({
    where: {
      id: req.params.busId,
    },
    data: {
      bo_id: req.body.bo_id,
      start_point: req.body.start_point,
      end_point: req.body.end_point,
      type: req.body.type,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      image_url: req.body.image_url,
      policy: req.body.policy,
      num_of_seats: req.body.num_of_seats,
      price: req.body.price,
    },
  });

  return busUpdated;
};
const getBusById = async (busId) => {
  const data = await prisma.buses.findUnique({
    where: {
      id: busId,
    },
    include: {
      bus_operators: {
        select: { name: true },
      },
      bus_stations_bus_stationsTobuses_start_point: {
        select: {
          name: true,
        },
      },
      bus_stations_bus_stationsTobuses_end_point: {
        select: {
          name: true,
        },
      },
    },
  });
  return data;
};
const busList = async (page, limit, req) => {
  let data = null;
  let condition = {};
  if (req.user.role == 'bus_operator') {
    user = await prisma.users.findFirst({
      where: {
        id: req.user.id,
      },
      select: {
        boid: true,
      },
    });
    condition = { bo_id: user.boid };
  }
  console.log(condition);
  data = await prisma.buses.findMany({
    skip: page * limit,
    take: limit,
    where: condition,

    include: {
      bus_operators: {
        select: {
          name: true, // MORE INFO
          image_url: true,
        },
      },
      bus_stations_bus_stationsTobuses_start_point: {
        select: {
          name: true,
        },
      },
      bus_stations_bus_stationsTobuses_end_point: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [
      {
        start_time: 'desc',
      },
    ],
  });

  return { data };
};
const bookingList = async (page, limit, req) => {
  let data = null;
  condition = {};
  if (req.user.role == 'bus_operator') {
    user = await prisma.users.findFirst({
      where: {
        id: req.user.id,
      },
      select: {
        boid: true,
      },
    });
    condition = { bo_id: user.boid };
  }
  data = await prisma.bus_tickets.findMany({
    skip: page * limit,
    take: limit,
    where: {
      buses: condition,
    },
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
  createBus,
  deleteBusById,
  updateBus,
  getBusById,
  bookingList,
  bookingUpdate,
  bookingGet,
  busList,
};
