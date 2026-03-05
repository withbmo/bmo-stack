import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { DiscoveryModule } from '@nestjs/core';

import { BillingQueue } from './billing.constants';

import { StripeService } from '../stripe/stripe.service';
import { StripeUtilsService } from '../stripe/stripe-utils.service';
import { BillingController } from './billing.controller';
import { BillingProcessor } from './billing.processor';
import { BillingAccessService } from './billing-access.service';
import { BillingFacadeService } from './billing-facade.service';
import { BillingPlansService } from './billing-plans.service';
import { BillingPriceCatalogValidatorService } from './billing-price-catalog-validator.service';
import { BillingStateService } from './billing-state.service';
import { BillingUsageControlsService } from './billing-usage-controls.service';
import { StripeContextService } from './stripe-context.service';
import { StripeCustomerService } from './stripe-customer.service';
import { StripeInvoiceService } from './stripe-invoice.service';
import { StripeSubscriptionService } from './stripe-subscription.service';
import { StripeSubscriptionReaderService } from './stripe-subscription-reader.service';
import { StripeUsageService } from './stripe-usage.service';
import { StripeWebhookProcessorService } from './stripe-webhook.processor.service';
import { StripeWebhookService } from './stripe-webhook.service';
import { StripeWebhookWorkerService } from './stripe-webhook.worker.service';
import { StripeWebhookExplorerService } from './stripe-webhook-explorer.service';
import { WebhookQueueService } from './webhook.queue';

@Module({
  imports: [DiscoveryModule, BullModule.registerQueue({ name: BillingQueue.Name })],
  controllers: [BillingController],
  providers: [
    StripeService,
    StripeUtilsService,
    BillingFacadeService,
    BillingPriceCatalogValidatorService,

    StripeContextService,
    StripeCustomerService,
    StripeInvoiceService,
    StripeSubscriptionService,
    StripeSubscriptionReaderService,
    StripeUsageService,

    BillingPlansService,
    BillingAccessService,
    BillingStateService,
    BillingUsageControlsService,

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
    BillingStateService,
    StripeUtilsService,
    StripeCustomerService,
    StripeUsageService,
  ],
})
export class BillingModule {}
