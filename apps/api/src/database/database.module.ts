import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service.js';
import { PrismaTxService } from './prisma-tx.service.js';

@Global()
@Module({
  providers: [PrismaTxService, PrismaService],
  exports: [PrismaTxService, PrismaService],
})
export class DatabaseModule {}
