const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().custom(password),
    repassword: Joi.string().required().custom(password),
  }),
};

const sendEmail = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().custom(password),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    newPassword: Joi.string().required().custom(password),
    repassword: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    otp: Joi.string().uuid().required(), // User enter otp
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendEmail,
};
