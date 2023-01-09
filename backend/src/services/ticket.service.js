/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */
/* eslint-disable prettier/prettier */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
// const phantomPath = require('witch')('phantomjs-prebuilt', 'phantomjs');
// import chromium from 'chrome-aws-lambda';
// const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer');
// if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
//   // running on the Vercel platform.
//   chrome = require('chrome-aws-lambda');
//   puppeteer = require('puppeteer-core');
// } else {
//   // running locally.

// }
// const pdf = require('pdf-creator-node');
const nodemailer = require('nodemailer');
const httpStatus = require('http-status');
const { PrismaClient } = require('@prisma/client');
const { ERROR_MESSAGE } = require('../constants/ticket.constant');
const ApiError = require('../utils/ApiError');
const path = require('path');

const prisma = new PrismaClient();

const payTicket = async (ticketIds) => {
  for (let i = 0; i < ticketIds.length; i++) {
    const ticket = await prisma.bus_tickets.update({
      where: {
        id: ticketIds[i],
      },
      data: {
        status: 1,
      },
    });
    if (!ticket) {
      throw new ApiError(httpStatus.NOT_FOUND, ERROR_MESSAGE.PAY_TICKET_ERROR);
    }
  }

  return { message: 'Pay ticket successfully' };
};

const createTicketByNumOfSeats = async (email, userId, busId, name, phone, numOfSeats) => {
  console.log('email', email);
  const checkBusIDExist = await prisma.buses.findUnique({
    where: {
      id: busId,
    },
    include: {
      bus_stations_bus_stationsTobuses_end_point: true,
      bus_stations_bus_stationsTobuses_start_point: true,
      bus_operators: true,
    },
  });

  if (!checkBusIDExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Bus ID Not found');
  }

  const checkUserIDExist = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });

  if (!checkUserIDExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User ID Not found');
  }

  const numOfSeatsBookedOrPayed = await prisma.bus_tickets.count({
    where: {
      bus_id: busId,
      status: { not: 2 },
    },
  });

  const numOfSeatsCanceled = await prisma.bus_tickets.count({
    where: {
      bus_id: busId,
      status: 2,
    },
  });

  if (numOfSeats + numOfSeatsBookedOrPayed - numOfSeatsCanceled > checkBusIDExist.num_of_seats) {
    return { error: ERROR_MESSAGE.NUM_OF_SEATS_EXCEED };
  }

  const allSeatPosArr = [];
  for (let i = 0; i < checkBusIDExist.num_of_seats; i++) {
    const checkSeatPosExist = await prisma.bus_tickets.findFirst({
      where: {
        bus_id: busId,
        seat: i.toString(),
        status: { not: 2 },
      },
    });
    if (!checkSeatPosExist) {
      allSeatPosArr.push(i.toString());
    }
  }

  const availableSeatPosArr = [];
  for (let i = 0; i < numOfSeats; ++i) {
    availableSeatPosArr.push({
      bus_id: busId,
      user_id: userId,
      name,
      phone,
      seat: allSeatPosArr[i],
    });
  }

  const result = { seat_positions: [], ticket_ids: [] };

  for (let i = 0; i < availableSeatPosArr.length; ++i) {
    const createTicket = await prisma.bus_tickets.create({
      data: availableSeatPosArr[i],
    });
    result.name = name;
    result.seat_positions.push(createTicket.seat);
    result.ticket_ids.push(createTicket.id);
    result.bo_name = checkBusIDExist.bus_operators.name;
    result.start_point = checkBusIDExist.bus_stations_bus_stationsTobuses_start_point.name;
    result.end_point = checkBusIDExist.bus_stations_bus_stationsTobuses_end_point.name;
    result.start_time = checkBusIDExist.start_time;
    result.end_time = checkBusIDExist.end_time;
    result.duration = Math.abs(checkBusIDExist.end_time.getTime() - checkBusIDExist.start_time.getTime());
    result.policy = checkBusIDExist.policy;
    result.num_of_seats = numOfSeats;
    result.type = checkBusIDExist.type;
    result.ticket_cost = checkBusIDExist.price;
    result.total_cost = checkBusIDExist.price * numOfSeats;
    result.status = 0;
  }

  const msToTime = (ms) => {
    const seconds = (ms / 1000).toFixed(1);
    const minutes = (ms / (1000 * 60)).toFixed(1);
    const hours = (ms / (1000 * 60 * 60)).toFixed(1);
    const days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
    if (seconds < 60) return `${seconds} Seconds`;
    if (minutes < 60) return `${minutes} Minutes`;
    if (hours < 24) return `${hours} Hours`;
    return `${days} Days`;
  };

  const template = `<div id="table">
    <table class="table table-hover table-striped">
      <tbody>
        <tr style="height: 80px">
          <th class="quarter-width align-middle ps-4">Full name</th>
          <td class="quarter-width align-middle">${name}</td>
          <th class="quarter-width align-middle ps-4">Email</th>
          <td class="quarter-width align-middle">${email}</td>
        </tr>
        <tr style="height: 80px">
          <th class="quarter-width align-middle ps-4">Ticket id</th>
          <td class="quarter-width align-middle">
            <ul class="disc-list-style-type px-3">${result.ticket_ids.join('<br>')}</ul>
          </td>
          <th class="quarter-width align-middle ps-4">Bus operator</th>
          <td class="quarter-width align-middle">${result.bo_name}</td>
        </tr>
        <tr style="height: 80px">
          <th class="quarter-width align-middle ps-4">Start point</th>
          <td class="quarter-width align-middle">${result.start_point}</td>
          <th class="quarter-width align-middle ps-4">End point</th>
          <td class="quarter-width align-middle">${result.end_point}</td>
        </tr>
        <tr style="height: 80px">
          <th class="quarter-width align-middle ps-4">Start time</th>
          <td class="quarter-width align-middle">
            ${new Date(result.start_time).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </td>
          <th class="quarter-width align-middle ps-4">End time</th>
          <td class="quarter-width align-middle">
            ${new Date(result.end_time).toLocaleDateString(undefined, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </td>
        </tr>
        <tr style="height: 80px">
          <th class="quarter-width align-middle ps-4">Duration</th>
          <td class="quarter-width align-middle">${msToTime(result.duration)}</td>
          <th class="quarter-width align-middle ps-4">Policy</th>
          <td class="quarter-width align-middle">${result.policy}</td>
        </tr>
        <tr style="height: 80px">
          <th class="quarter-width align-middle ps-4">Number of seats</th>
          <td class="quarter-width align-middle">${result.num_of_seats}</td>
          <th class="quarter-width align-middle ps-4">Type of bus</th>
          <td class="quarter-width align-middle">
            ${result.type === 0 ? 'Limousine' : result.type === 1 ? 'Normal Seat' : 'Sleeper Bus'}
          </td>
        </tr>
        <tr style="height: 80px">
          <th class="quarter-width align-middle ps-4">Ticket cost</th>
          <td class="quarter-width align-middle">${result.ticket_cost} VND</td>
          <th class="quarter-width align-middle ps-4">Total cost</th>
          <td class="quarter-width align-middle">${result.total_cost} VND</td>
        </tr>
        <tr style="height: 80px">
          <th class="quarter-width align-middle ps-4">Seat positions</th>
          <td class="quarter-width align-middle">${result.seat_positions.join(', ')}</td>
          <th class="quarter-width align-middle ps-4">Status</th>
          <td class="quarter-width align-middle">
            ${result.status === 0 ? 'Booked' : result.status === 1 ? 'Paid' : 'Canceled'}
          </td>
        </tr>
      </tbody>
    </table>
  </div>`;

  const ticketIdsFormatted = await result.ticket_ids.map((tid) => `<li>${tid}</li>`);
  const startTime = new Date(result.start_time).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
  const endTime = new Date(result.end_time).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
  const durationFormatted = await msToTime(result.duration);
  const busType = result.type === 0 ? 'Limousine' : result.type === 1 ? 'Normal Seat' : 'Sleeper Bus';
  const statusTmp = result.status === 0 ? 'Booked' : result.status === 1 ? 'Paid' : 'Canceled';
  const seatPositions = result.seat_positions.join(', ');

  const templateHTML = `<div id="table">
    <table class="table table-hover table-striped">
      <tbody>
        <tr style="height: 80px">
          <th class="quarter-width align-middle ps-4">Full name</th>
          <td class="quarter-width align-middle">{{name}}</td>
          <th class="quarter-width align-middle ps-4">Email</th>
          <td class="quarter-width align-middle">{{email}}</td>
        </tr>
        <tr style="height: 80px">
          <th class="quarter-width align-middle ps-4">Ticket id</th>
          <td class="quarter-width align-middle">
            <ul class="disc-list-style-type px-3">{{ticketIdsFormatted}}</ul>
          </td>
          <th class="quarter-width align-middle ps-4">Bus operator</th>
          <td class="quarter-width align-middle">{{result.bo_name}}</td>
        </tr>
        <tr style="height: 80px">
          <th class="quarter-width align-middle ps-4">Start point</th>
          <td class="quarter-width align-middle">{{result.start_point}}</td>
          <th class="quarter-width align-middle ps-4">End point</th>
          <td class="quarter-width align-middle">{{result.end_point}}</td>
        </tr>
        <tr style="height: 80px">
          <th class="quarter-width align-middle ps-4">Start time</th>
          <td class="quarter-width align-middle">
            {{startTime}}
          </td>
          <th class="quarter-width align-middle ps-4">End time</th>
          <td class="quarter-width align-middle">
            {{endTime}}
          </td>
        </tr>
        <tr style="height: 80px">
          <th class="quarter-width align-middle ps-4">Duration</th>
          <td class="quarter-width align-middle">{{durationFormatted}}</td>
          <th class="quarter-width align-middle ps-4">Policy</th>
          <td class="quarter-width align-middle">{{result.policy}}</td>
        </tr>
        <tr style="height: 80px">
          <th class="quarter-width align-middle ps-4">Number of seats</th>
          <td class="quarter-width align-middle">{{result.num_of_seats}}</td>
          <th class="quarter-width align-middle ps-4">Type of bus</th>
          <td class="quarter-width align-middle">
            {{busType}}
          </td>
        </tr>
        <tr style="height: 80px">
          <th class="quarter-width align-middle ps-4">Ticket cost</th>
          <td class="quarter-width align-middle">{{result.ticket_cost}} VND</td>
          <th class="quarter-width align-middle ps-4">Total cost</th>
          <td class="quarter-width align-middle">{{result.total_cost}} VND</td>
        </tr>
        <tr style="height: 80px">
          <th class="quarter-width align-middle ps-4">Seat positions</th>
          <td class="quarter-width align-middle">{{seatPositions}}</td>
          <th class="quarter-width align-middle ps-4">Status</th>
          <td class="quarter-width align-middle">
            {{statusTmp}}
          </td>
        </tr>
      </tbody>
    </table>
  </div>`;

  // console.log(template);

  const options = {
    format: 'A5',
    orientation: 'portrait',
    border: '10mm',
    header: {
      height: '45mm',
      contents: `<div style="text-align: center;">Author: ${email}</div>`,
    },
    footer: {
      height: '28mm',
      contents: {
        first: 'Cover page',
        2: 'Second page', // Any page number is working. 1-based index
        default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        last: 'Last Page',
      },
    },
  };
  const document = {
    html: templateHTML,
    data: {
      name,
      email,
      result,
      ticketIdsFormatted,
      startTime,
      endTime,
      durationFormatted,
      busType,
      statusTmp,
      seatPositions,
    },
    path: path.join(__dirname, '../output/ticket-information.pdf'),
    // phantomPath: `${phantomPath}`,
    type: '',
  };

  try {
    console.log('test 0');

    // Create browser instance
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      // defaultViewport: puppeteer.defaultViewport,
      // executablePath: await puppeteer.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    });
    console.log('test 1');

    // Create a new page
    const page = await browser.newPage();
    console.log('test 2');

    // Set HTML as page content
    await page.setContent(
      `<div id="table">
    <table class="table table-hover table-striped">
      <tbody>
        <tr style="height: 80px">
          <th class="quarter-width align-middle ps-4">Full name</th>
          <td class="quarter-width align-middle">${name}</td>
          <th class="quarter-width align-middle ps-4">Email</th>
          <td class="quarter-width align-middle">${email}</td>
        </tr>
        <tr style="height: 80px">
          <th class="quarter-width align-middle ps-4">Ticket id</th>
          <td class="quarter-width align-middle">
            <ul class="disc-list-style-type px-3">${ticketIdsFormatted}</ul>
          </td>
          <th class="quarter-width align-middle ps-4">Bus operator</th>
          <td class="quarter-width align-middle">${result.bo_name}</td>
        </tr>
        <tr style="height: 80px">
          <th class="quarter-width align-middle ps-4">Start point</th>
          <td class="quarter-width align-middle">${result.start_point}</td>
          <th class="quarter-width align-middle ps-4">End point</th>
          <td class="quarter-width align-middle">${result.end_point}</td>
        </tr>
        <tr style="height: 80px">
          <th class="quarter-width align-middle ps-4">Start time</th>
          <td class="quarter-width align-middle">
          ${startTime}
          </td>
          <th class="quarter-width align-middle ps-4">End time</th>
          <td class="quarter-width align-middle">
          ${endTime}
          </td>
        </tr>
        <tr style="height: 80px">
          <th class="quarter-width align-middle ps-4">Duration</th>
          <td class="quarter-width align-middle">${durationFormatted}</td>
          <th class="quarter-width align-middle ps-4">Policy</th>
          <td class="quarter-width align-middle">${result.policy}</td>
        </tr>
        <tr style="height: 80px">
          <th class="quarter-width align-middle ps-4">Number of seats</th>
          <td class="quarter-width align-middle">${result.num_of_seats}</td>
          <th class="quarter-width align-middle ps-4">Type of bus</th>
          <td class="quarter-width align-middle">
          ${busType}
          </td>
        </tr>
        <tr style="height: 80px">
          <th class="quarter-width align-middle ps-4">Ticket cost</th>
          <td class="quarter-width align-middle">${result.ticket_cost} VND</td>
          <th class="quarter-width align-middle ps-4">Total cost</th>
          <td class="quarter-width align-middle">${result.total_cost} VND</td>
        </tr>
        <tr style="height: 80px">
          <th class="quarter-width align-middle ps-4">Seat positions</th>
          <td class="quarter-width align-middle">${seatPositions}</td>
          <th class="quarter-width align-middle ps-4">Status</th>
          <td class="quarter-width align-middle">
          ${statusTmp}
          </td>
        </tr>
      </tbody>
    </table>
  </div>`,
      { waitUntil: 'domcontentloaded' }
    );
    console.log('test 55');
    console.log('__dirname', __dirname);
    // Save PDF File
    await page.pdf({ path: 'ticket-information.pdf', format: 'a4' });

    console.log('test 3');
    // await pdf.create(document, options);

    console.log('test 4');
    const transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 465,
      secure: true,
      auth: {
        user: 'apikey',
        pass: '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',
      },
    });

    const mailOptions = {
      from: 'Web-HCMUS <group9notification@gmail.com>',
      to: email,
      subject: 'Ticket information',
      html: `<html><body>${template}</body></html>`,
      attachments: [
        {
          filename: 'ticket-information.pdf',
          path: 'ticket-information.pdf',
          contentType: 'application/pdf',
        },
      ],
    };

    console.log('test 5');
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.log('email not sent', error);
    return false;
  }

  return result;
};

const getTicketByBusIdAndUserId = async (busId, userId) => {
  return prisma.bus_tickets.findMany({
    where: {
      bus_id: busId,
      user_id: userId,
    },
  });
};
const discardTicket = async (req) => {
  const checkTicket = await prisma.bus_tickets.findUnique({
    where: {
      id: req.body.tid,
    },
  });
  if (!checkTicket) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ticket not found');
  }
  return prisma.bus_tickets.update({
    where: {
      id: req.body.tid,
    },
    data: {
      status: 2,
    },
  });
};
module.exports = {
  discardTicket,
  createTicketByNumOfSeats,
  getTicketByBusIdAndUserId,
  payTicket,
};
