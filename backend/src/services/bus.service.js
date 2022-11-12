const httpStatus = require('http-status');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ApiError = require('../utils/ApiError');

const searchBus = async (req, res) => {
  return {};
};

const getBusInformation = async (req, res) => {
  return {
    bao: 'vui',
  };
};

module.exports = {
  searchBus,
  getBusInformation,
};
