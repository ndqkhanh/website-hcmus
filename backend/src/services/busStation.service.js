const { PrismaClient } = require('@prisma/client');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const prisma = new PrismaClient();

const getBusStationById = async (id) => {
  const busStation = await prisma.bus_stations.findUnique({ where: { id } });
  if (!busStation) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This bus station does not exist');
  }
  const station = busStation.name.concat(', ', busStation.location);
  return station;
};
module.exports = { getBusStationById };
