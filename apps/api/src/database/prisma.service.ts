import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { prisma } from '@pytholit/db';

import { PrismaTxService } from './prisma-tx.service.js';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly rootClient = prisma;

  constructor(private readonly prismaTx: PrismaTxService) {}

  get client() {
    return this.prismaTx.client;
  }

  private hasDatabaseConfig(): boolean {
    return Boolean(
      process.env.DB_HOST &&
        process.env.DB_USERNAME &&
        process.env.DB_PASSWORD &&
        process.env.DB_NAME
    );
  }

  async onModuleInit(): Promise<void> {
    if (!this.hasDatabaseConfig()) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, and DB_PASSWORD are required in production.');
      }

      this.logger.warn(
        'Database env vars are not set. Skipping Prisma connection in non-production mode.'
      );
      return;
    }

    await this.rootClient.$connect();
    this.logger.log('Database connected');
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.hasDatabaseConfig()) {
      return;
    }

    await this.rootClient.$disconnect();
    this.logger.log('Database disconnected');
  }
}
