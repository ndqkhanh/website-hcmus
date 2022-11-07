/* eslint-disable camelcase */
/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import bo_record from './bus_operators.json';
import bs_record from './bus_stations.json';
import buses_record from './buses.json';
import reviews_record from './reviews.json';
import bt_record from './bus_tickets.json';

const prisma = new PrismaClient();

async function main() {
  const database = {
    users: [
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
        id: 'c118f693-8722-4461-a79d-d76991b96sfs',
        email: 'user1@gmail.com',
        role: 1,
        password: Buffer.from('$2a$10$uR5S.P86tXoBfCHl0a03bePKyN/1yE/1oCW5oRNs/IYfbDeL.WY9O'),
        create_time: '2022-03-22T12:26:44.480Z',
        update_time: '2022-08-27T14:43:55.772Z',
      },
      {
        id: 'c118f693-8722-4461-a79d-d76991b96hgf',
        email: 'user2@gmail.com',
        role: 1,
        password: Buffer.from('$2a$10$uR5S.P86tXoBfCHl0a03bePKyN/1yE/1oCW5oRNs/IYfbDeL.WY9O'),
        create_time: '2022-03-22T12:26:44.480Z',
        update_time: '2022-08-27T14:43:55.772Z',
      },
    ],
    bo_record,
    bs_record,
    buses_record,
    reviews_record,
    bt_record,
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
