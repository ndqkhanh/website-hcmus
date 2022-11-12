/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const searchBus = async (body) => {
  const { startPoint, endPoint, page, limit, boId, price, type } = body;
  const query = {
    start_point: startPoint,
    end_point: endPoint,
  };

  if (boId) {
    query.bo_id = boId;
  }

  if (typeof type === 'number') {
    query.type = type;
  }

  if (typeof price === 'number') {
    query.price = {
      gt: price,
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

    bus.leftSeats =
      bus.num_of_seats -
      (await prisma.bus_tickets.count({
        where: {
          bus_id: bus.id,
          status: {
            in: [0, 1],
          },
        },
      }));

    bus.averageReviews = (
      await prisma.reviews.aggregate({
        _avg: {
          rate: true,
        },
      })
    )._avg.rate;
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

module.exports = {
  searchBus,
  getBusInformation,
};
