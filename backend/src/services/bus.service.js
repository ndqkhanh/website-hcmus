/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { PrismaClient } = require('@prisma/client');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const prisma = new PrismaClient();

const searchBus = async (body) => {
  const { startPoint, endPoint, page, limit, boId, price, type, startTime } = body;

  const query = {
    start_point: startPoint,
    end_point: endPoint,
  };

  if (startTime) {
    query.start_time = {
      gte: startTime,
    };
  }

  if (boId) {
    query.bo_id = boId;
  }

  if (typeof type === 'number') {
    query.type = type;
  }

  if (typeof price === 'number') {
    query.price = {
      gte: price,
    };
  }
  const data = await prisma.buses.findMany({
    skip: page * limit,
    take: limit,
    where: query,
    include: {
      bus_operators: true,
      bus_stations_bus_stationsTobuses_end_point: true,
      bus_stations_bus_stationsTobuses_start_point: true,
    },
  });

  for (const bus of data) {
    bus.start_point = bus.bus_stations_bus_stationsTobuses_start_point;
    bus.end_point = bus.bus_stations_bus_stationsTobuses_end_point;
    delete bus.bus_stations_bus_stationsTobuses_start_point;
    delete bus.bus_stations_bus_stationsTobuses_end_point;

    bus.left_seats =
      bus.num_of_seats -
      (await prisma.bus_tickets.count({
        where: {
          bus_id: bus.id,
          status: {
            in: [0, 1],
          },
        },
      }));

    bus.averageReviews =
      Math.round(
        (
          await prisma.reviews.aggregate({
            _avg: {
              rate: true,
            },
            where: {
              bo_id: bus.bo_id,
            },
          })
        )._avg.rate * 10
      ) / 10;
  }

  const count = await prisma.buses.count({
    where: query,
  });
  return { count, data };
};

const getBusInformation = async (busId) => {
  const data = await prisma.buses.findFirst({
    where: {
      id: busId,
    },
    include: {
      bus_operators: true,
      bus_stations_bus_stationsTobuses_end_point: true,
      bus_stations_bus_stationsTobuses_start_point: 'end_point',
    },
  });

  return data;
};

const cloneBus = async (id, startTime, endTime) => {
  const busTemplate = await prisma.buses.findUnique({
    where: { id },
  });

  if (startTime.getTime() > endTime.getTime()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Start time and end time is invalidate');
  }

  const newBus = await prisma.buses.create({
    data: {
      bo_id: busTemplate.bo_id,
      start_point: busTemplate.start_point,
      end_point: busTemplate.end_point,
      type: busTemplate.type,
      start_time: startTime,
      end_time: endTime,
      image_url: busTemplate.image_url,
      policy: busTemplate.policy,
      num_of_seats: busTemplate.num_of_seats,
      price: busTemplate.price,
    },
  });

  return newBus;
};

const getBusById = async (id) => {
  return prisma.buses.findUnique({ where: { id } });
};
module.exports = {
  searchBus,
  getBusInformation,
  cloneBus,
  getBusById,
};
