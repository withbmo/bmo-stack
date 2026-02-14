/**
 * @pytholit/db - Database client and utilities
 *
 * This package provides the Prisma client and database utilities
 * for the Pytholit application.
 */

import { PrismaClient } from './generated/client';

// Singleton Prisma client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Export Prisma types
export * from './generated/client';

// Export utilities
export * from './utils';
