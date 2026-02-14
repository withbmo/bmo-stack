import { PrismaClient } from '@prisma/client';
import { PLANS } from '@pytholit/config';

const prisma = new PrismaClient();

async function main() {
  const validPlanIds = new Set(PLANS.map((plan) => plan.id));
  const validList = [...validPlanIds];

  const result = await prisma.subscription.deleteMany({
    where: {
      OR: [
        { planId: null },
        { planId: { notIn: validList } },
      ],
    },
  });

  console.log(`Deleted ${result.count} subscription(s) with invalid planId.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
