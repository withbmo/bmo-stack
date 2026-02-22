import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { BillingConfigService } from './billing.config';
import { BillingController } from './billing.controller';
import { BillingFacadeService } from './billing-facade.service';
import { LagoService } from './lago.service';
import { LagoWebhookHandler } from './lago-webhook.handler';
import { SignupBonusRetryProcessor } from './signup-bonus-retry.processor';
import { SignupBonusRetryScheduler } from './signup-bonus-retry.scheduler';
import { SignupCreditsService } from './signup-credits.service';
import { WebhookProcessor } from './webhook.processor';
import { WebhookQueue } from './webhook.queue';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'billing-webhooks',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    }),
    BullModule.registerQueue({
      name: 'billing-signup-bonus-retry',
      defaultJobOptions: {
        attempts: 1,
      },
    }),
  ],
  controllers: [BillingController],
  providers: [
    BillingConfigService,
    BillingFacadeService,
    LagoService,
    LagoWebhookHandler,
    SignupCreditsService,
    SignupBonusRetryScheduler,
    SignupBonusRetryProcessor,
    WebhookQueue,
    WebhookProcessor,
  ],
  exports: [
    BillingConfigService,
    BillingFacadeService,
    LagoService,
    SignupCreditsService,
    WebhookQueue,
  ],
})
export class BillingModule {}
