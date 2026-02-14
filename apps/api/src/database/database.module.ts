import { Global,Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';

/**
 * Database Module
 * Provides Prisma client as a global service
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
