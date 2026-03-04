/**
 * Delete all users from the database
 * Run with: pnpm --filter @pytholit/db db:delete-all-users
 *
 * This will cascade delete: Account, Session, Otp, Project, Environment,
 * DeployJob (triggeredBy set to null), WizardBuild, Invoice, Subscription,
 * CreditLedgerEntry, AuditLog
 */

import { PrismaClient } from '../src/generated/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.user.deleteMany({});
  console.log(`Deleted ${result.count} user(s).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
