import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';

// Type definitions
export interface CustomerDetails {
  customerId?: string;
  email?: string;
  name?: string;
  phone?: string;
  metadata?: Record<string, string>;
}

export interface PaymentMethodDetails {
  id?: string;
  type?: string;
  last4?: string;
  brand?: string;
  expMonth?: number;
  expYear?: number;
  billingDetails?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: Stripe.Address;
  };
  metadata?: Record<string, string>;
}

export interface RefundInfo {
  refunded: boolean;
  refundedAmount?: number;
  refundCount?: number;
  refunds?: Array<{
    id: string;
    amount: number;
    status: string;
    reason?: string;
    created: Date;
    metadata?: Record<string, string>;
  }>;
}

export interface SubscriptionItemDetails {
  id: string;
  priceId: string;
  quantity?: number;
  metadata?: Record<string, string>;
}

export interface SubscriptionDetails {
  id: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialStart?: Date;
  trialEnd?: Date;
  cancelAt?: Date;
  canceledAt?: Date;
  endedAt?: Date;
  metadata?: Record<string, string>;
  items?: SubscriptionItemDetails[];
}

@Injectable()
export class StripeUtilsService {
  private readonly logger = new Logger(StripeUtilsService.name);

  constructor(private readonly stripeService: StripeService) {}

  /**
   * Extracts customer details from various Stripe objects
   * Always attempts to fetch full customer details when possible
   */
  async getCustomerDetails(
    object: Stripe.PaymentIntent | Stripe.Charge | Stripe.Subscription | (Stripe.Customer | Stripe.DeletedCustomer)
  ): Promise<CustomerDetails> {
    try {
      let customerId: string | undefined;

      // Extract the customer ID based on object type
      if (this.isCustomer(object)) {
        customerId = object.id;
      } else if (this.isPaymentIntent(object) || this.isCharge(object)) {
        const customer = object.customer;
        customerId = typeof customer === 'string' ? customer : customer?.id;
      } else if (this.isSubscription(object)) {
        customerId = object.customer as string;
      }

      // If we have a customer ID, try to fetch full customer details
      if (customerId) {
        try {
          const stripe = this.stripeService.client();
          const customer = await stripe.customers.retrieve(customerId);

          if (this.isDeletedCustomer(customer)) {
            return { customerId: customer.id };
          }

          return {
            customerId: customer.id,
            email: customer.email ?? undefined,
            name: customer.name ?? undefined,
            phone: customer.phone ?? undefined,
            metadata: customer.metadata ? { ...customer.metadata } : undefined,
          };
        } catch (error) {
          this.logger.warn(
            `Failed to fetch customer details for ID ${customerId}: ${(error as Error).message}`
          );
          return { customerId };
        }
      }

      // Fallback: If we can't get the customer ID or fetch fails, return what we can from the original object
      if (this.isCustomer(object)) {
        if (this.isDeletedCustomer(object)) {
          return { customerId: object.id };
        }
        return {
          customerId: object.id,
          email: object.email ?? undefined,
          name: object.name ?? undefined,
          phone: object.phone ?? undefined,
          metadata: object.metadata ? { ...object.metadata } : undefined,
        };
      }

      return {};
    } catch (error) {
      this.logger.error(`Error getting customer details: ${(error as Error).message}`);
      return {};
    }
  }

  /**
   * Extracts receipt URL from a Payment Intent, Charge, or Invoice
   */
  async getReceiptUrl(object: Stripe.PaymentIntent | Stripe.Charge | Stripe.Invoice): Promise<string | undefined> {
    try {
      const stripe = this.stripeService.client();

      if (this.isCharge(object)) {
        // Fetch fresh charge data to ensure we have the latest receipt URL
        const charge = await stripe.charges.retrieve(object.id);
        return charge.receipt_url ?? undefined;
      }

      if (this.isPaymentIntent(object)) {
        // Fetch fresh payment intent to get the latest charge
        const paymentIntent = await stripe.paymentIntents.retrieve(object.id, {
          expand: ['latest_charge']
        });

        if (paymentIntent.latest_charge && typeof paymentIntent.latest_charge !== 'string') {
          return paymentIntent.latest_charge.receipt_url ?? undefined;
        }

        return paymentIntent.latest_charge ? `https://dashboard.stripe.com/payments/${paymentIntent.latest_charge}` : undefined;
      }

      if (this.isInvoice(object)) {
        // Fetch fresh invoice data
        const invoice = await stripe.invoices.retrieve(object.id);
        return invoice.hosted_invoice_url ?? undefined;
      }

      return undefined;
    } catch (error) {
      this.logger.error(`Error getting receipt URL: ${(error as Error).message}`);
      return undefined;
    }
  }

  /**
   * Gets detailed payment method information
   */
  async getPaymentMethodDetails(
    object: Stripe.PaymentIntent | Stripe.Charge | Stripe.PaymentMethod | string
  ): Promise<PaymentMethodDetails> {
    try {
      const stripe = this.stripeService.client();
      let paymentMethodId: string | undefined;

      // Extract payment method ID based on input type
      if (typeof object === 'string') {
        paymentMethodId = object;
      } else if (this.isPaymentMethod(object)) {
        paymentMethodId = object.id;
      } else if (this.isPaymentIntent(object)) {
        paymentMethodId =
          typeof object.payment_method === 'string' ? object.payment_method : object.payment_method?.id;
      } else if (this.isCharge(object)) {
        paymentMethodId = typeof object.payment_method === 'string' ? object.payment_method : undefined;
      }

      // If we have a payment method ID, fetch full details
      if (paymentMethodId) {
        try {
          const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

          const pm = paymentMethod as any;
          if (paymentMethod.type === 'card' && paymentMethod.card) {
            return {
              id: paymentMethod.id,
              type: paymentMethod.type,
              last4: paymentMethod.card.last4,
              brand: paymentMethod.card.brand,
              expMonth: paymentMethod.card.exp_month,
              expYear: paymentMethod.card.exp_year,
              billingDetails: pm.billing_details,
              metadata: pm.metadata,
            };
          }

          return {
            id: paymentMethod.id,
            type: paymentMethod.type,
            billingDetails: pm.billing_details,
            metadata: pm.metadata,
          };
        } catch (error) {
          this.logger.warn(
            `Failed to fetch payment method details for ID ${paymentMethodId}: ${(error as Error).message}`
          );
        }
      }

      // Fallback to original object data if fetch fails
      if (this.isPaymentMethod(object)) {
        const obj = object as any;
        if (object.type === 'card' && object.card) {
          return {
            id: object.id,
            type: object.type,
            last4: object.card.last4,
            brand: object.card.brand,
            expMonth: object.card.exp_month,
            expYear: object.card.exp_year,
            billingDetails: obj.billing_details,
            metadata: obj.metadata,
          };
        }
      }

      return {};
    } catch (error) {
      this.logger.error(`Error getting payment method details: ${(error as Error).message}`);
      return {};
    }
  }

  /**
   * Gets comprehensive refund information for a payment
   */
  async getRefundInfo(object: Stripe.Charge | Stripe.PaymentIntent): Promise<RefundInfo> {
    try {
      const stripe = this.stripeService.client();
      let chargeId: string | undefined;

      if (this.isCharge(object)) {
        chargeId = object.id;
      } else if (this.isPaymentIntent(object)) {
        const paymentIntent = await stripe.paymentIntents.retrieve(object.id, {
          expand: ['latest_charge']
        });
        chargeId =
          typeof paymentIntent.latest_charge === 'string' ? paymentIntent.latest_charge : paymentIntent.latest_charge?.id;
      }

      if (chargeId) {
        const charge = await stripe.charges.retrieve(chargeId, {
          expand: ['refunds']
        });

        const refundsList = charge.refunds?.data?.map((refund) => {
          const ref = refund as any;
          return {
            id: refund.id,
            amount: refund.amount,
            status: refund.status || 'succeeded',
            reason: ref.reason,
            created: new Date(refund.created * 1000),
            metadata: ref.metadata,
          };
        });

        return {
          refunded: charge.refunded,
          refundedAmount: charge.amount_refunded,
          refundCount: refundsList?.length ?? 0,
          refunds: refundsList,
        };
      }

      return { refunded: false };
    } catch (error) {
      this.logger.error(`Error getting refund info: ${(error as Error).message}`);
      return { refunded: false };
    }
  }

  /**
   * Gets full subscription details including current period and trial information
   */
  async getSubscriptionDetails(object: Stripe.Subscription | string): Promise<SubscriptionDetails> {
    try {
      const stripe = this.stripeService.client();
      const subscriptionId = typeof object === 'string' ? object : object.id;
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      const sub = subscription as any;
      return {
        id: subscription.id,
        status: this.standardizeSubscriptionStatus(subscription.status),
        currentPeriodStart: new Date(sub.current_period_start * 1000),
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
        trialStart: sub.trial_start ? new Date(sub.trial_start * 1000) : undefined,
        trialEnd: sub.trial_end ? new Date(sub.trial_end * 1000) : undefined,
        cancelAt: sub.cancel_at ? new Date(sub.cancel_at * 1000) : undefined,
        canceledAt: sub.canceled_at ? new Date(sub.canceled_at * 1000) : undefined,
        endedAt: sub.ended_at ? new Date(sub.ended_at * 1000) : undefined,
        metadata: subscription.metadata,
        items: subscription.items.data.map((item) => ({
          id: item.id,
          priceId: typeof item.price === 'string' ? item.price : item.price.id,
          quantity: item.quantity,
          metadata: item.metadata,
        })),
      };
    } catch (error) {
      this.logger.error(`Error getting subscription details: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Formats currency amounts consistently
   */
  formatAmount(amount: number, currency: string = 'usd'): string {
    try {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: 2,
      });

      return formatter.format(amount / 100);
    } catch (error) {
      this.logger.error(`Error formatting amount: ${(error as Error).message}`);
      return `${(amount / 100).toFixed(2)}`;
    }
  }

  // Type guards
  private isPaymentIntent(object: any): object is Stripe.PaymentIntent {
    return object?.object === 'payment_intent';
  }

  private isCharge(object: any): object is Stripe.Charge {
    return object?.object === 'charge';
  }

  private isInvoice(object: any): object is Stripe.Invoice {
    return object?.object === 'invoice';
  }

  private isCustomer(object: any): object is Stripe.Customer | Stripe.DeletedCustomer {
    return object?.object === 'customer';
  }

  private isDeletedCustomer(object: any): object is Stripe.DeletedCustomer {
    return object?.deleted === true;
  }

  private isSubscription(object: any): object is Stripe.Subscription {
    return object?.object === 'subscription';
  }

  private isPaymentMethod(object: any): object is Stripe.PaymentMethod {
    return object?.object === 'payment_method';
  }

  // Status standardization helper
  private standardizeSubscriptionStatus(status: Stripe.Subscription.Status): string {
    const statusMap: Record<Stripe.Subscription.Status, string> = {
      incomplete: 'pending',
      incomplete_expired: 'failed',
      trialing: 'trialing',
      active: 'active',
      past_due: 'past_due',
      canceled: 'canceled',
      unpaid: 'unpaid',
      paused: 'paused',
    };
    return statusMap[status] || status;
  }
}
