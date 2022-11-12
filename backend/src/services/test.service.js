const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { model } = require('mongoose');
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

const resetPassword = async()=>{

    return prisma.bus_stations.findFirst(
        {}
    ) 
}

module.exports={
    resetPassword,
}
