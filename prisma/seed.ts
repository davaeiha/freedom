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

  console.log('Seeding...');

  await prisma.package.createMany({
    data: packages,
  });
}

main()
  .catch((error) => console.error(error))
  .finally(async () => {
    await prisma.$disconnect();
  });
