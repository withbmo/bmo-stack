import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { StripeService } from '../stripe/stripe.service';
import { StripeUtilsService } from '../stripe/stripe-utils.service';
import { BillingController } from './billing.controller';
import { BillingProcessor } from './billing.processor';
import { BillingAccessService } from './billing-access.service';
import { BillingFacadeService } from './billing-facade.service';
import { BillingPlansService } from './billing-plans.service';
import { BillingStateService } from './billing-state.service';
import { StripeCustomerService } from './stripe-customer.service';
import { StripeUsageService } from './stripe-usage.service';
import { StripeWebhookProcessorService } from './stripe-webhook.processor.service';
import { StripeWebhookService } from './stripe-webhook.service';
import { StripeWebhookWorkerService } from './stripe-webhook.worker.service';
import { StripeWebhookExplorerService } from './stripe-webhook-explorer.service';
import { WebhookQueueService } from './webhook.queue';

@Module({
  imports: [DiscoveryModule],
  controllers: [BillingController],
  providers: [
    StripeService,
    StripeUtilsService,
    BillingFacadeService,

    StripeCustomerService,
    StripeUsageService,

    BillingPlansService,
    BillingAccessService,
    BillingStateService,

    StripeWebhookService,
    StripeWebhookProcessorService,
    StripeWebhookExplorerService,
    StripeWebhookWorkerService,

    BillingProcessor,
    WebhookQueueService,
  ],
  exports: [
    BillingFacadeService,
    BillingAccessService,
    StripeUtilsService,
    StripeCustomerService,
    StripeUsageService,
  ],
})
export class BillingModule {}
