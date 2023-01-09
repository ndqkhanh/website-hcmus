/* eslint-disable prettier/prettier */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
const { PrismaClient } = require('@prisma/client');

const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const prisma = new PrismaClient();

const getBusStations = async () => {
  console.log('vui');
  const data = await prisma.bus_stations.findMany({});
  console.log('vui 2');
  return { data };
};

const getBusStationById = async (id) => {
  const busStation = await prisma.bus_stations.findUnique({ where: { id } });
  if (!busStation) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This bus station does not exist');
  }
  const station = busStation.name.concat(', ', busStation.location);
  return station;
};
module.exports = {
  getBusStations,
  getBusStationById,
};
