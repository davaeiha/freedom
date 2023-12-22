import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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
      role: 'ADMIN',
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
      credit: 0,
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
      credit: 0,
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
      credit: 0,
      created_at: '2023-10-27T11:23:44.886Z',
      updated_at: null,
    },
  ];

  const packages = [
    {
      id: '97c710b4-66a3-403b-8a70-3dc358970a45',
      price: 1,
      traffic: 0.25,
      userCount: 0,
      expirationDays: 30,
    },
    {
      id: 'd106803c-90e4-4496-b6cc-d4707456f6c3',
      price: 5,
      traffic: 1,
      userCount: 0,
      expirationDays: 30,
    },
    {
      id: '77d364dc-6b30-4fe2-a66e-d0649666873d',
      price: 20,
      traffic: 5,
      userCount: 0,
      expirationDays: 30,
    },
    {
      id: '27c3f170-65a8-4472-94cd-0d5176137636',
      price: 35,
      traffic: 10,
      userCount: 0,
      expirationDays: 30,
    },
    {
      id: 'bf17020b-d140-4052-ae6a-bff1bd3979ae',
      price: 60,
      traffic: 20,
      userCount: 0,
      expirationDays: 30,
    },
    {
      id: '0bdcf582-afce-4eb7-85fe-9af2692c8129',
      price: 75,
      traffic: 30,
      userCount: 0,
      expirationDays: 30,
    },
    {
      id: '01d02c21-77a2-4ff4-92d6-84c9fe309773',
      price: 100,
      traffic: 40,
      userCount: 0,
      expirationDays: 30,
    },
    {
      id: '3e82bccb-b2ad-4e5d-8549-d9685734f72d',
      price: 144,
      traffic: 60,
      userCount: 0,
      expirationDays: 30,
    },
    {
      id: 'd9d42d3f-c679-4378-a7a0-f8e5524e5630',
      price: 184,
      traffic: 80,
      userCount: 0,
      expirationDays: 30,
    },
    {
      id: 'e2f2512a-75f2-452b-beed-16aff5a73321',
      price: 220,
      traffic: 100,
      userCount: 0,
      expirationDays: 30,
    },
    {
      id: 'a8c9cf7c-cc63-4204-89b0-4964202059c2',
      price: 252,
      traffic: 120,
      userCount: 0,
      expirationDays: 30,
    },
    {
      id: '4b7c7db3-3d05-4780-8390-491368bb4d70',
      price: 320,
      traffic: 160,
      userCount: 0,
      expirationDays: 30,
    },
    {
      id: '726c27f2-19eb-41c5-84e5-c78b381b304a',
      price: 380,
      traffic: 200,
      userCount: 0,
      expirationDays: 30,
    },
    {
      id: '723926e6-7e43-45d5-8d4b-9f313ae70e4e',
      price: 850,
      traffic: 500,
      userCount: 0,
      expirationDays: 30,
    },
  ];
  console.log('Seeding...');

  await prisma.user.createMany({
    data: users as any,
  });

  await prisma.package.createMany({
    data: packages as any,
  });
}

main()
  .catch((error) => console.error(error))
  .finally(async () => {
    await prisma.$disconnect();
  });
