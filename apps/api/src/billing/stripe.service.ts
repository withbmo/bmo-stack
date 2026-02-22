import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Stripe from 'stripe';

import { BillingConfigService } from './billing.config';

@Injectable()
export class StripeService implements OnModuleInit {
  private stripe?: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(private readonly billingConfig: BillingConfigService) {}

  onModuleInit(): void {
    const apiKey = this.billingConfig.stripeSecretKey;

    if (!apiKey) {
      this.logger.warn('STRIPE_SECRET_KEY not configured - billing features disabled');
      return;
    }

    this.stripe = new Stripe(apiKey, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  getClient(): Stripe {
    if (!this.stripe) {
      throw new Error('Stripe is not configured');
    }
    return this.stripe;
  }

  async createCustomer(params: {
    email: string;
    name?: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Customer> {
    return this.getClient().customers.create(params);
  }

  async createSetupCheckoutSession(params: {
    customerId: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Checkout.Session> {
    return this.getClient().checkout.sessions.create({
      customer: params.customerId,
      mode: 'setup',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata,
    });
  }

  async createPaymentCheckoutSession(params: {
    customerId: string;
    amountCents: number;
    productName: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Checkout.Session> {
    return this.getClient().checkout.sessions.create({
      customer: params.customerId,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: params.amountCents,
            product_data: {
              name: params.productName,
            },
          },
          quantity: 1,
        },
      ],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata,
    });
  }

  async createPortalSession(params: {
    customerId: string;
    returnUrl: string;
  }): Promise<Stripe.BillingPortal.Session> {
    return this.getClient().billingPortal.sessions.create({
      customer: params.customerId,
      return_url: params.returnUrl,
    });
  }

  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return this.getClient().subscriptions.retrieve(subscriptionId);
  }

  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return this.getClient().subscriptions.cancel(subscriptionId);
  }

  constructWebhookEvent(payload: string | Buffer, signature: string, secret: string): Stripe.Event {
    return this.getClient().webhooks.constructEvent(payload, signature, secret);
  }
}
