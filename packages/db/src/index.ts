/**
 * @pytholit/db - Database client and utilities
 *
 * This package provides the Prisma client and database utilities
 * for the Pytholit application.
 */

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client';

const DEFAULT_DB_PORT = '5432';
const DEFAULT_SSL_MODE = 'require';
const DB_SCHEMA = 'public';
const DEFAULT_LOCAL_DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/postgres?schema=public';

function resolveDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const dbName = process.env.DB_NAME;
  const port = process.env.DB_PORT || DEFAULT_DB_PORT;
  const sslMode = process.env.DB_SSLMODE || DEFAULT_SSL_MODE;

  if (!host || !user || !password || !dbName) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('DATABASE_URL is required in production.');
    }
    process.env.DATABASE_URL = DEFAULT_LOCAL_DATABASE_URL;
    return DEFAULT_LOCAL_DATABASE_URL;
  }

  const encodedUser = encodeURIComponent(user);
  const encodedPassword = encodeURIComponent(password);
  const params = new URLSearchParams({ schema: DB_SCHEMA, sslmode: sslMode });

  const url = `postgresql://${encodedUser}:${encodedPassword}@${host}:${port}/${dbName}?${params.toString()}`;
  process.env.DATABASE_URL = url;
  return url;
}

const databaseUrl = resolveDatabaseUrl();

// Singleton Prisma client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Export Prisma types
export * from './generated/client';

// Export utilities
export * from './utils';
