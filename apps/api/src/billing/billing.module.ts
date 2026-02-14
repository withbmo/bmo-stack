import { Module } from '@nestjs/common';

import { EntitlementsModule } from '../entitlements/entitlements.module';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { StripeService } from './stripe.service';

@Module({
  imports: [EntitlementsModule],
  controllers: [BillingController],
  providers: [BillingService, StripeService],
  exports: [BillingService, StripeService],
})
export class BillingModule {}
