import { Injectable, Logger, OnModuleDestroy,OnModuleInit } from '@nestjs/common';
import { prisma } from '@pytholit/db';

/**
 * Prisma Service
 * Wraps the Prisma client for use in Nest.js
 */
@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  // Use the singleton Prisma client from @pytholit/db
  client = prisma;

  private buildDatabaseUrlFromParts(): string | null {
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT;
    const name = process.env.DB_NAME;
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;

    if (!host || !port || !name || !user || !password) {
      return null;
    }

    const sslmode = process.env.DB_SSLMODE || 'require';
    const encodedUser = encodeURIComponent(user);
    const encodedPassword = encodeURIComponent(password);
    return `postgresql://${encodedUser}:${encodedPassword}@${host}:${port}/${name}?schema=public&sslmode=${sslmode}`;
  }

  async onModuleInit() {
    if (!process.env.DATABASE_URL) {
      const builtUrl = this.buildDatabaseUrlFromParts();
      if (builtUrl) {
        process.env.DATABASE_URL = builtUrl;
        this.logger.log('DATABASE_URL constructed from DB_* environment variables.');
      }
    }

    if (!process.env.DATABASE_URL) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('DATABASE_URL is required in production.');
      }

      this.logger.warn(
        'DATABASE_URL is not set. Skipping Prisma connection in non-production mode.'
      );
      return;
    }

    await this.client.$connect();
    this.logger.log('Database connected');
  }

  async onModuleDestroy() {
    if (!process.env.DATABASE_URL) {
      return;
    }

    await this.client.$disconnect();
    this.logger.log('Database disconnected');
  }
}
