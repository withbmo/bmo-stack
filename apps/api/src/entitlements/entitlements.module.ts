import { Module } from '@nestjs/common';

import { BillingModule } from '../billing/billing.module';
import { DatabaseModule } from '../database/database.module';
import { EntitlementsController } from './entitlements.controller';
import { EntitlementsService } from './entitlements.service';

@Module({
  imports: [DatabaseModule, BillingModule],
  controllers: [EntitlementsController],
  providers: [EntitlementsService],
  exports: [EntitlementsService],
})
export class EntitlementsModule {}
