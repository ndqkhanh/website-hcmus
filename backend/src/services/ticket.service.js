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

  const busTickets = await prisma.bus_tickets.createMany({
    data: availableSeatPosArr,
  });

  return busTickets;
};

const getTicketByBusIdAndUserId = async (busId, userId) => {
  return prisma.bus_tickets.findMany({
    where: {
      bus_id: busId,
      user_id: userId,
    },
  });
};
module.exports = {
  createTicketByNumOfSeats,
  getTicketByBusIdAndUserId,
};
