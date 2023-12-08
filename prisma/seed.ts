import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // await prisma.user.deleteMany();

  const packages = [
    {
      month: 1,
      volume: 20,
      cost: 1200,
    },
    {
      month: 1,
      volume: 40,
      cost: 1200,
    },
    {
      month: 1,
      volume: 60,
      cost: 1200,
    },
    {
      month: 1,
      volume: 80,
      cost: 1200,
    },
    {
      month: 1,
      volume: 100,
      cost: 1200,
    },
    {
      month: 1,
      volume: 120,
      cost: 1200,
    },
    {
      month: 1,
      volume: 160,
      cost: 1200,
    },
    {
      month: 1,
      volume: 200,
      cost: 1200,
    },
    {
      month: 3,
      volume: 60,
      cost: 1200,
    },
    {
      month: 3,
      volume: 120,
      cost: 1200,
    },
    {
      month: 3,
      volume: 180,
      cost: 1200,
    },
    {
      month: 3,
      volume: 240,
      cost: 1200,
    },
    {
      month: 3,
      volume: 300,
      cost: 1200,
    },
    {
      month: 3,
      volume: 360,
      cost: 1200,
    },
    {
      month: 3,
      volume: 480,
      cost: 1200,
    },
    {
      month: 3,
      volume: 600,
      cost: 1200,
    },
    {
      month: 6,
      volume: 120,
      cost: 1200,
    },
    {
      month: 6,
      volume: 180,
      cost: 1200,
    },
    {
      month: 6,
      volume: 240,
      cost: 1200,
    },
    {
      month: 6,
      volume: 360,
      cost: 1200,
    },
    {
      month: 6,
      volume: 480,
      cost: 1200,
    },
    {
      month: 6,
      volume: 600,
      cost: 1200,
    },
    {
      month: 6,
      volume: 720,
      cost: 1200,
    },
    {
      month: 6,
      volume: 960,
      cost: 1200,
    },
    {
      month: 6,
      volume: 1200,
      cost: 1200,
    },
  ];

  const users = [
    {
      id: 129532814,
      phone: null,
      password: null,
      name: null,
      username: null,
      role: 'USER',
      credit: 0,
      created_at: '2023-10-27T11:23:44.886Z',
      updated_at: null,
    },
    {
      id: 118763170,
      phone: null,
      password: null,
      name: 'Masih',
      username: 'masihjahangiri',
      role: 'USER',
      credit: 0,
      created_at: '2023-10-27T11:23:44.886Z',
      updated_at: null,
    },
    {
      id: 110070888,
      phone: null,
      password: null,
      name: 'Ghazal',
      username: 'Ghazal_k6',
      role: 'USER',
      credit: 10800,
      created_at: '2023-11-05T12:03:43.184Z',
      updated_at: '2023-11-05T12:06:24.825Z',
    },
    {
      id: 807852032,
      phone: null,
      password: null,
      name: 'Hamed',
      username: 'top_gshop',
      role: 'USER',
      credit: 1200,
      created_at: '2023-10-31T14:19:26.969Z',
      updated_at: '2023-11-06T13:33:15.049Z',
    },
    {
      id: 438081538,
      phone: null,
      password: null,
      name: 'Mahdi',
      username: 'mahdi_davaeiha',
      role: 'ADMIN',
      credit: 624148,
      created_at: '2023-10-27T11:23:44.886Z',
      updated_at: '2023-11-09T15:55:31.816Z',
    },
    {
      id: 52612744,
      phone: null,
      password: null,
      name: 'Amin niknam',
      username: 'aminniknam93',
      role: 'USER',
      credit: 9600,
      created_at: '2023-10-27T11:23:44.886Z',
      updated_at: '2023-11-09T16:18:16.400Z',
    },
    {
      id: 585211785,
      phone: null,
      password: null,
      name: 'Oliver',
      username: 'oliver1999',
      role: 'USER',
      credit: 500,
      created_at: '2023-10-27T11:23:44.886Z',
      updated_at: null,
    },
  ];
  console.log('Seeding...');

  await prisma.package.createMany({
    data: packages,
  });

  await prisma.user.createMany({
    data: users as any,
  });
}

main()
  .catch((error) => console.error(error))
  .finally(async () => {
    await prisma.$disconnect();
  });
