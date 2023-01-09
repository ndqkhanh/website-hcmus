const nodemailer = require('nodemailer');
const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');

const { tokenTypes } = require('../config/tokens');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (user) user.password = user.password.toString();
  // if (!user || !(await user.isPasswordMatch(password))) {
  //   throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  // }
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (email, newPassword, repassword) => {
  try {
    if (newPassword !== repassword) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Password is not matched with repassword');
    }

    const user = await userService.getUserByEmail(email);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Can not find this email!');
    }
    await userService.updateUserById(user.id, newPassword);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
  return true;
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (req) => {
  try {
    const email = req.body.email;
    const otp = req.body.otp;
    const user = await prisma.users.findFirst({
      where: {
        email,
      },
    });

    const verification = await prisma.user_verification.findFirst({
      where: {
        uid: user.id,
      },
    });
    console.log('otp', otp);
    console.log('verification.code', verification.code);
    if (!verification || verification.code !== otp) return false;

    await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        verification: true,
      },
    });
    return true;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};
const sendEmail = async (req) => {
  const email = req.body.email;

  const user = await prisma.users.findFirst({
    where: {
      email,
    },
  });

  let user_verification = await prisma.user_verification.findFirst({
    where: {
      uid: user.id,
    },
  });

  if (!user_verification || user_verification === {}) {
    user_verification = await prisma.user_verification.create({
      data: {
        uid: user.id,
      },
    });
  }
  console.log(user_verification);

  try {
    console.log('test 1');
    const transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 465,
      secure: true,
      auth: {
        user: 'apikey',
        pass: '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',
      },
    });
    console.log('test 2');

    const mailOptions = {
      from: 'Web-HCMUS <group9notification@gmail.com>',
      to: email,
      subject: 'Verify email',
      text: '\nPlease enter your code ' + user_verification.code,
    };
    console.log('test 3');

    const info = await transporter.sendMail(mailOptions);
    console.log('test 4', info.response);
  } catch (error) {
    console.log('email not sent', error);
    return false;
  }
  return true;
};
module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
  sendEmail,
};
