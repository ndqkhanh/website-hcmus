/* eslint-disable import/prefer-default-export */
/* eslint-disable camelcase */
/* eslint-disable no-console */
const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const bus_stations = require('./bus_stations.json');
const buses = require('./buses.json');
const reviews = require('./reviews.json');
const bus_tickets = require('./bus_tickets.json');
const bus_operators = require('./bus_operators.json');

const prisma = new PrismaClient();

const createBusOperator = () => {
  return {
    id: faker.datatype.uuid(),
    image_url: faker.image.imageUrl(180, 180),
    phone: faker.phone.number('##########'),
    name: faker.name.fullName(),
  };
};

const createBusStation = () => {
  return {
    id: faker.datatype.uuid(),
    location: faker.address.cityName(),
    name: faker.name.jobArea(),
  };
};

const USERS = [
  {
    id: 'c118f693-8722-4461-a79d-d76991b96a9e',
    email: 'nguyenphucbao68@gmail.com',
    role: 0,
    password: Buffer.from('$2a$10$uR5S.P86tXoBfCHl0a03bePKyN/1yE/1oCW5oRNs/IYfbDeL.WY9O'),
    create_time: '2022-03-22T12:26:44.480Z',
    update_time: '2022-08-27T14:43:55.772Z',
  },
  {
    id: 'c118f693-8722-4461-a79d-d76991b96bcd',
    email: 'khanhndq2002@gmail.com',
    role: 0,
    password: Buffer.from('$2a$10$uR5S.P86tXoBfCHl0a03bePKyN/1yE/1oCW5oRNs/IYfbDeL.WY9O'),
    create_time: '2022-03-22T12:26:44.480Z',
    update_time: '2022-08-27T14:43:55.772Z',
  },
  {
    id: 'c118f693-8722-4461-a79d-d76991b96afd',
    email: 'busop1@gmail.com',
    role: 1,
    password: Buffer.from('$2a$10$uR5S.P86tXoBfCHl0a03bePKyN/1yE/1oCW5oRNs/IYfbDeL.WY9O'),
    create_time: '2022-03-22T12:26:44.480Z',
    update_time: '2022-08-27T14:43:55.772Z',
  },
  {
    id: 'c118f693-8722-4461-a79d-d76991b96acf',
    email: 'busop2@gmail.com',
    role: 1,
    password: Buffer.from('$2a$10$uR5S.P86tXoBfCHl0a03bePKyN/1yE/1oCW5oRNs/IYfbDeL.WY9O'),
    create_time: '2022-03-22T12:26:44.480Z',
    update_time: '2022-08-27T14:43:55.772Z',
  },
  {
    id: 'c118f693-8722-4461-a79d-d76991b96fdf',
    email: 'user1@gmail.com',
    role: 2,
    password: Buffer.from('$2a$10$uR5S.P86tXoBfCHl0a03bePKyN/1yE/1oCW5oRNs/IYfbDeL.WY9O'),
    create_time: '2022-03-22T12:26:44.480Z',
    update_time: '2022-08-27T14:43:55.772Z',
  },
  {
    id: 'c118f693-8722-4461-a79d-d76991b96abf',
    email: 'user2@gmail.com',
    role: 2,
    password: Buffer.from('$2a$10$uR5S.P86tXoBfCHl0a03bePKyN/1yE/1oCW5oRNs/IYfbDeL.WY9O'),
    create_time: '2022-03-22T12:26:44.480Z',
    update_time: '2022-08-27T14:43:55.772Z',
  },
];
const BUS_OPERATORS = [];
const BUS_STATIONS = [];
const BUSES = [];
const BUS_TICKETS = [];
const REVIEWS = [];

// select count(*) as sl, DATE(start_time), start_point, end_point
// from buses
// group by start_point, end_point, DATE(start_time)
// order by sl desc, DATE(start_time) desc

const createBuses = () => {
  const currentTime = new Date().getTime();
  const month = 262974383;
  const start_time = faker.datatype.datetime({ min: currentTime, max: currentTime + month });
  return {
    id: faker.datatype.uuid(),
    bo_id: BUS_OPERATORS[Math.floor(Math.random() * BUS_OPERATORS.length)].id,
    start_point: BUS_STATIONS[Math.floor(Math.random() * BUS_STATIONS.length)].id,
    end_point: BUS_STATIONS[Math.floor(Math.random() * BUS_STATIONS.length)].id,
    type: 1,
    start_time,
    end_time: faker.datatype.datetime({ min: new Date(start_time).getTime(), max: currentTime + month }),
    image_url: faker.image.imageUrl(300, 200),
    policy:
      '<ul><li>WHILE ON BOARD<ul><li>Holding your ticket</li><li>Be silent</li></ul></li><li>YOUR PACKAGE<ul><li>Not over 10kg</li></ul></li></ul>',
    num_of_seats: faker.datatype.number({ min: 10, max: 50 }),
    price: faker.datatype.number({ min: 1000000, max: 10000000 }),
  };
};

const createBusTickets = () => {
  const bus = BUSES[Math.floor(Math.random() * BUSES.length)];
  return {
    id: faker.datatype.uuid(),
    bus_id: bus.id,
    user_id: USERS[Math.floor(Math.random() * USERS.length)].id,
    name: faker.name.fullName(),
    phone: faker.phone.number('##########'),
    seat: faker.datatype.number({ min: 1, max: bus.num_of_seats }).toString(),
    status: faker.datatype.number({ min: 0, max: 2 }),
  };
};

const createReview = () => {
  return {
    id: faker.datatype.uuid(),
    comment: faker.lorem.lines(1),
    user_id: USERS[Math.floor(Math.random() * USERS.length)].id,
    bo_id: BUS_OPERATORS[Math.floor(Math.random() * BUS_OPERATORS.length)].id,
    rate: faker.datatype.number({ min: 1, max: 5 }),
  };
};

async function main() {
  Array.from({ length: 15 }).forEach(() => {
    BUS_OPERATORS.push(createBusOperator());
  });

  Array.from({ length: 10 }).forEach(() => {
    BUS_STATIONS.push(createBusStation());
  });

  Array.from({ length: 50000 }).forEach(() => {
    BUSES.push(createBuses());
  });

  Array.from({ length: 400 }).forEach(() => {
    BUS_TICKETS.push(createBusTickets());
  });

  Array.from({ length: 1000 }).forEach(() => {
    REVIEWS.push(createReview());
  });
  const database = {
    users: USERS,
    bus_operators: BUS_OPERATORS,
    bus_stations: BUS_STATIONS,
    buses: BUSES,
    reviews: REVIEWS,
    bus_tickets: BUS_TICKETS,
  };

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(database)) {
    // eslint-disable-next-line no-await-in-loop
    await prisma[key].createMany({
      data: value,
      skipDuplicates: true,
    });
    console.log(`Seeded ${key}!`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
