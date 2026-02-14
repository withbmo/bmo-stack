import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

/**
 * Stripe Service
 * Wrapper for Stripe SDK
 */
@Injectable()
export class StripeService implements OnModuleInit {
  private stripe?: Stripe;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('STRIPE_SECRET_KEY');

    if (!apiKey) {
      console.warn('STRIPE_SECRET_KEY not configured - billing features disabled');
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

  /**
   * Create Stripe customer
   */
  async createCustomer(params: {
    email: string;
    name?: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Customer> {
    return this.getClient().customers.create(params);
  }

  /**
   * Create checkout session
   */
  async createCheckoutSession(params: {
    customerId: string;
    priceId: string;
    successUrl: string;
    cancelUrl: string;
    metadata?: Record<string, string>;
    subscriptionMetadata?: Record<string, string>;
  }): Promise<Stripe.Checkout.Session> {
    return this.getClient().checkout.sessions.create({
      customer: params.customerId,
      mode: 'subscription',
      line_items: [
        {
          price: params.priceId,
          quantity: 1,
        },
      ],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata,
      subscription_data: params.subscriptionMetadata
        ? { metadata: params.subscriptionMetadata }
        : undefined,
    });
  }

  /**
   * Create billing portal session
   */
  async createPortalSession(params: {
    customerId: string;
    returnUrl: string;
  }): Promise<Stripe.BillingPortal.Session> {
    return this.getClient().billingPortal.sessions.create({
      customer: params.customerId,
      return_url: params.returnUrl,
    });
  }

  /**
   * Get subscription
   */
  async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return this.getClient().subscriptions.retrieve(subscriptionId);
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return this.getClient().subscriptions.cancel(subscriptionId);
  }

  /**
   * Construct webhook event
   */
  constructWebhookEvent(
    payload: string | Buffer,
    signature: string,
    secret: string
  ): Stripe.Event {
    return this.getClient().webhooks.constructEvent(payload, signature, secret);
  }
}
