/* eslint-disable prettier/prettier */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
const httpStatus = require('http-status');
const { PrismaClient } = require('@prisma/client');
const { ERROR_MESSAGE } = require('../constants/ticket.constant');
const ApiError = require('../utils/ApiError');

const prisma = new PrismaClient();

const createTicketByNumOfSeats = async (userId, busId, name, phone, numOfSeats) => {
  const checkBusIDExist = await prisma.buses.findUnique({
    where: {
      id: busId,
    },
    include: {
      bus_stations_bus_stationsTobuses_end_point: true,
      bus_stations_bus_stationsTobuses_start_point: true,
      bus_operators: true,
    },
  });

  if (!checkBusIDExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bus ID Not found');
  }

  const checkUserIDExist = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });

  if (!checkUserIDExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User ID Not found');
  }

  const numOfSeatsBookedOrPayed = await prisma.bus_tickets.count({
    where: {
      bus_id: busId,
      status: { not: 2 },
    },
  });

  const numOfSeatsCanceled = await prisma.bus_tickets.count({
    where: {
      bus_id: busId,
      status: 2,
    },
  });

  if (numOfSeats + numOfSeatsBookedOrPayed - numOfSeatsCanceled > checkBusIDExist.num_of_seats) {
    return { error: ERROR_MESSAGE.NUM_OF_SEATS_EXCEED };
  }

  const allSeatPosArr = [];
  for (let i = 0; i < checkBusIDExist.num_of_seats; i++) {
    const checkSeatPosExist = await prisma.bus_tickets.findFirst({
      where: {
        bus_id: busId,
        seat: i.toString(),
      },
    });
    if (!checkSeatPosExist) {
      allSeatPosArr.push(i.toString());
    }
  }

  const availableSeatPosArr = [];
  for (let i = 0; i < numOfSeats; ++i) {
    availableSeatPosArr.push({
      bus_id: busId,
      user_id: userId,
      name,
      phone,
      seat: allSeatPosArr[i],
    });
  }

  const result = { seat_positions: [], ticket_ids: [] };

  for (let i = 0; i < availableSeatPosArr.length; ++i) {
    const createTicket = await prisma.bus_tickets.create({
      data: availableSeatPosArr[i],
    });
    result.name = name;
    result.seat_positions.push(createTicket.seat);
    result.ticket_ids.push(createTicket.id);
    result.bo_name = checkBusIDExist.bus_operators.name;
    result.start_point = checkBusIDExist.bus_stations_bus_stationsTobuses_start_point.name;
    result.end_point = checkBusIDExist.bus_stations_bus_stationsTobuses_end_point.name;
    result.start_time = checkBusIDExist.start_time;
    result.end_time = checkBusIDExist.end_time;
    result.duration = Math.abs(checkBusIDExist.end_time.getTime() - checkBusIDExist.start_time.getTime());
    result.policy = checkBusIDExist.policy;
    result.num_of_seats = numOfSeats;
    result.type = checkBusIDExist.type;
    result.ticket_cost = checkBusIDExist.price;
    result.total_cost = checkBusIDExist.price * numOfSeats;
    result.status = 0;
  }

  return result;
};

module.exports = {
  createTicketByNumOfSeats,
};
