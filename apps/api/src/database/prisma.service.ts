import { Injectable, Logger, OnModuleDestroy,OnModuleInit } from '@nestjs/common';
import { prisma } from '@pytholit/db';

/**
 * Prisma Service
 * Wraps the Prisma client for use in Nest.js
 */
@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

  // Use the singleton Prisma client from @pytholit/db
  client = prisma;

  async onModuleInit() {
    if (!this.hasDatabaseUrl) {
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
    if (!this.hasDatabaseUrl) {
      return;
    }

    await this.client.$disconnect();
    this.logger.log('Database disconnected');
  }
}
