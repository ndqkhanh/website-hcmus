const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  const saltRounds = 10;

  userBody.password = await bcrypt.hash(userBody.password, saltRounds);

  const checkUsername = await prisma.users.findUnique({
    where: {
      username: userBody.username,
    },
  });

  if (checkUsername) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username already taken');
  }

  const user = prisma.users.create({
    data: userBody,
  });

  return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

const getUserById = async (id) => {
  const user = await prisma.users.findUnique({
    where: {
      id,
    },
  });
  user.numOfQuestions = await prisma.questions.count({
    where: {
      uid: id,
    },
  });
  user.numOfAnswers = await prisma.answers.count({
    where: {
      uid: id,
    },
  });
  return user;
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByUsername = async (username) => {
  return prisma.users.findUnique({
    where: {
      username,
    },
  });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const checkUserExists = await getUserById(userId);
  if (!checkUserExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const user = await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      name: updateBody.name,
      profilepictureurl: updateBody.profilepictureurl,
    },
  });
  return user;
};

const countMyQuestions = async (req) => {
  const questions = await prisma.questions.findMany({
    where: { uid: req.user.id },
  });

  return questions.length;
};

const getMyQuestionsPagination = async (req) => {
  const questions = await prisma.questions.findMany({
    skip: req.params.page * req.params.limit,
    take: req.params.limit,
    where: {
      uid: req.user.id,
    },
  });

  return questions;
};
module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByUsername,
  updateUserById,
  countMyQuestions,
  getMyQuestionsPagination,
};
