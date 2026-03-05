import { Injectable } from '@nestjs/common';
import {
  type BillingInterval,
  type CheckoutSessionResponse,
  type InvoiceListResponse,
  type PaidPlanId,
  type Plan,
  type Subscription,
} from '@pytholit/contracts';

import { BillingPlansService } from './billing-plans.service';
import { StripeInvoiceService } from './stripe-invoice.service';
import { StripeSubscriptionService } from './stripe-subscription.service';
import { StripeSubscriptionReaderService } from './stripe-subscription-reader.service';
import { StripeWebhookService } from './stripe-webhook.service';

@Injectable()
export class BillingFacadeService {
  constructor(
    private readonly plans: BillingPlansService,
    private readonly stripeWebhook: StripeWebhookService,
    private readonly stripeSubscription: StripeSubscriptionService,
    private readonly stripeInvoice: StripeInvoiceService,
    private readonly stripeSubscriptionReader: StripeSubscriptionReaderService
  ) {}

  /** Returns billing plans loaded from local JSON config. */
  getPlans(): Plan[] {
    return this.plans.getPlans();
  }

  async getSubscriptionResponse(userId: string): Promise<{ subscription: Subscription | null }> {
    return this.stripeSubscriptionReader.getSubscriptionResponse(userId);
  }

  async getInvoices(
    userId: string,
    limit = 25,
    startingAfter?: string
  ): Promise<InvoiceListResponse> {
    return this.stripeInvoice.getInvoices(userId, limit, startingAfter);
  }

  async createPortalSession(userId: string): Promise<{ url: string }> {
    return this.stripeSubscription.createPortalSession(userId);
  }

  async cancelSubscriptionAtPeriodEnd(userId: string): Promise<{ cancelAtPeriodEnd: true }> {
    return this.stripeSubscription.cancelSubscriptionAtPeriodEnd(userId);
  }

  async reactivateSubscription(userId: string): Promise<{ cancelAtPeriodEnd: false }> {
    return this.stripeSubscription.reactivateSubscription(userId);
  }

  async cancelScheduledDowngrade(userId: string): Promise<{ cleared: true }> {
    return this.stripeSubscription.cancelScheduledDowngrade(userId);
  }

  async createCreditTopupSession(userId: string, amountUsd: number): Promise<{ url: string }> {
    return this.stripeSubscription.createCreditTopupSession(userId, amountUsd);
  }

  async createCheckoutSession(
    userId: string,
    planId: PaidPlanId,
    interval: BillingInterval
  ): Promise<CheckoutSessionResponse> {
    return this.stripeSubscription.createCheckoutSession(userId, planId, interval);
  }

  async finalizeCheckoutSession(
    userId: string,
    pendingPlanCode: PaidPlanId
  ): Promise<CheckoutSessionResponse> {
    return this.stripeSubscription.finalizeCheckoutSession(userId, pendingPlanCode);
  }

  async getDefaultPaymentMethod(userId: string): Promise<{
    id: string;
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    isDefault: boolean;
  } | null> {
    return this.stripeInvoice.getDefaultPaymentMethod(userId);
  }

  /** Receives raw Stripe webhook payload and delegates signature/processing logic. */
  async receiveStripeWebhook(rawBody: Buffer, signatureHeader: string | undefined): Promise<void> {
    return this.stripeWebhook.receiveWebhook(rawBody, signatureHeader);
  }
}
