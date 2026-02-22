import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { prisma } from '@pytholit/db';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  client = prisma;

  async onModuleInit(): Promise<void> {
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

  async onModuleDestroy(): Promise<void> {
    if (!process.env.DATABASE_URL) {
      return;
    }

    await this.client.$disconnect();
    this.logger.log('Database disconnected');
  }
}
