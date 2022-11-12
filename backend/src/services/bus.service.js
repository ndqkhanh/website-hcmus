const httpStatus = require('http-status');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ApiError = require('../utils/ApiError');

const searchBus = async (req, res) => {
  return {};
};

const getBusInformation = async (busId) => {
  const data = await prisma.buses.findUnique({
    where: {
      id: busId,
    },
  });
  return data;
};

module.exports = {
  searchBus,
  getBusInformation,
};
