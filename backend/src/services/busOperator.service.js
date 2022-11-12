const { PrismaClient } = require('@prisma/client');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const prisma = new PrismaClient();

const getBusOperatorById = async (id) => {
  return prisma.bus_operators.findUnique({ where: { id } });
};
module.exports = { getBusOperatorById };
