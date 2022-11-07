const httpStatus = require('http-status');
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const ApiError = require('../utils/ApiError');
const userService = require('./user.service');

const getAllMetrics = async () => {
  const questionCount = await prisma.questions.count();
  const userCount = await prisma.users.count();
  const answerCount = await prisma.answers.count();
  return { numOfQuestions: questionCount, numOfUsers: userCount, numOfAnswers: answerCount };
};

const disableUser = async (req) => {
  const checkUserExists = await userService.getUserById(req.params.userId);
  if (!checkUserExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (!(checkUserExists.role === 2)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is a moderator or an admin');
  }
  if (checkUserExists.disabled === true && req.body.status === true) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already banned');
  } else if (checkUserExists.disabled === false && req.body.status === false) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already unbanned');
  }
  const user = await prisma.users.update({
    where: { id: req.params.userId },
    data: { disabled: req.body.status },
  });
  return user;
};

const setConfiguration = async (req) => {
  const isConfigExist = await prisma.configuration.findUnique({
    where: { slug: req.params.slug },
  });

  if (!isConfigExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Configuration Not Found');
  }

  const config = await prisma.configuration.update({
    where: { slug: req.params.slug },
    data: {
      value: req.body.value,
    },
  });

  return config;
};

const getPendingQuestions = async (page, limit) => {
  const listPendingQuestions = await prisma.questions.findMany({
    skip: page * limit,
    take: limit,
    where: {
      status: 0,
    },
    orderBy: {
      updated_at: 'desc',
    },
  });
  const countPendingQuestions = await prisma.questions.count({
    where: {
      status: 0,
    },
  });

  for (let i = 0; i < listPendingQuestions.length; i++) {
    const question = listPendingQuestions[i];
    question.userData = await prisma.users.findUnique({
      where: {
        id: question.uid,
      },
      select: {
        name: true,
        profilepictureurl: true,
      },
    });
  }
  return { count: countPendingQuestions, data: listPendingQuestions };
};

const approveDeclineQuestion = async (questionId, status) => {
  const question = await prisma.questions.findUnique({
    where: { id: questionId },
  });
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }
  if (question.status !== 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Question is already approved or declined');
  }
  const questionResult = await prisma.questions.update({
    where: { id: questionId },
    data: {
      status: status === 0 ? 2 : 1,
      updated_at: new Date(),
    },
  });
  return questionResult;
};

const getUsers = async (page, limit) => {
  const listUsers = await prisma.users.findMany({
    skip: page * limit,
    take: limit,
    select: {
      id: true,
      username: true,
      profilepictureurl: true,
      role: true,
      name: true,
      disabled: true,
    },
  });
  const countUsers = await prisma.users.count();
  return { count: countUsers, data: listUsers };
};

const listConfigurations = async () => {
  const Configurations = await prisma.configuration.findMany({
    select: {
      slug: true,
      value: true,
    },
  });
  return Configurations;
};

module.exports = {
  getAllMetrics,
  disableUser,
  getPendingQuestions,
  approveDeclineQuestion,
  getUsers,
  listConfigurations,
  setConfiguration,
};
