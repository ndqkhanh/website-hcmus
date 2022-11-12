/* eslint-disable prettier/prettier */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getBusStations = async () => {
  const data = await prisma.bus_stations.findMany({});
  return { data };
};

module.exports = {
  getBusStations,
};
