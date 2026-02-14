/**
 * Database seed script
 * Run with: pnpm --filter @pytholit/db db:seed
 */

import { PrismaClient } from '../src/generated/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  console.log('✅ Seed completed');
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
