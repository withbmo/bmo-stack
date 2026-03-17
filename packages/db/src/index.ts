/**
 * @pytholit/db - Database client and utilities
 *
 * This package provides the Prisma client and database utilities
 * for the Pytholit application.
 */

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client.js';

const DEFAULT_DB_PORT = '5432';
const DEFAULT_SSL_MODE = 'require';
const DB_SCHEMA = 'public';
const DEFAULT_LOCAL_DB = {
  host: 'localhost',
  port: DEFAULT_DB_PORT,
  dbName: 'pytholit',
  user: 'postgres',
  password: 'postgres',
  sslMode: 'disable',
} as const;

function buildDatabaseUrl(options: {
  host: string;
  port: string;
  dbName: string;
  user: string;
  password: string;
  sslMode: string;
}): string {
  const encodedUser = encodeURIComponent(options.user);
  const encodedPassword = encodeURIComponent(options.password);
  const params = new URLSearchParams({ schema: DB_SCHEMA, sslmode: options.sslMode });
  return `postgresql://${encodedUser}:${encodedPassword}@${options.host}:${options.port}/${options.dbName}?${params.toString()}`;
}

function resolveDatabaseUrl(): string {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USERNAME;
  const password = process.env.DB_PASSWORD;
  const dbName = process.env.DB_NAME;
  const port = process.env.DB_PORT || DEFAULT_DB_PORT;
  const sslMode = process.env.DB_SSLMODE || DEFAULT_SSL_MODE;

  if (!host || !user || !password || !dbName) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, and DB_PASSWORD are required in production.');
    }
    return buildDatabaseUrl(DEFAULT_LOCAL_DB);
  }

  return buildDatabaseUrl({ host, port, dbName, user, password, sslMode });
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
export * from './generated/client.js';

// Export utilities
export * from './utils.js';
