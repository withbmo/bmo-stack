import { Global, Module } from '@nestjs/common';

import { PrismaTxService } from './prisma-tx.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaTxService, PrismaService],
  exports: [PrismaTxService, PrismaService],
})
export class DatabaseModule {}
