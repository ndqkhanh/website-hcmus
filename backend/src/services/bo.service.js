/* eslint-disable prettier/prettier */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
const httpStatus = require('http-status');
const { PrismaClient } = require('@prisma/client');
const ApiError = require('../utils/ApiError');

const prisma = new PrismaClient();

const getReviews = async (boId, page, limit) => {
  const checkBoIdExist = await prisma.bus_operators.findUnique({
    where: {
      id: boId,
    },
  });
  if (!checkBoIdExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bus operator not found');
  }

  const data = await prisma.reviews.findMany({
    skip: page * limit,
    take: limit,
    where: {
      bo_id: boId,
    },
  });
  const count = await prisma.reviews.count({
    where: {
      bo_id: boId,
    },
  });

  return { count, data };
};

const createReview = async (userId, boId, rate, comment) => {
  const checkBoIdExist = await prisma.bus_operators.findUnique({
    where: {
      id: boId,
    },
  });
  if (!checkBoIdExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bus operator not found');
  }

  const checkUserIdExist = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });
  if (!checkUserIdExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (rate < 0 || rate > 5) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Rate must be between 0 and 5');
  }

  const data = await prisma.reviews.create({
    data: {
      bo_id: boId,
      user_id: userId,
      rate,
      comment,
    },
  });

  return data;
};

const getBusOperatorById = async (id) => {
  return prisma.bus_operators.findUnique({ where: { id } });
};
module.exports = {
  getReviews,
  createReview,
  getBusOperatorById,
};
