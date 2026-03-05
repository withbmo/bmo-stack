import { Injectable } from '@nestjs/common';
import type { InvoiceListResponse } from '@pytholit/contracts';
import type Stripe from 'stripe';

import { StripeContextService } from './stripe-context.service';

@Injectable()
export class StripeInvoiceService {
  constructor(private readonly stripeContext: StripeContextService) {}

  /** Returns Stripe invoices for a user with cursor pagination (`starting_after`). */
  async getInvoices(
    userId: string,
    limit = 25,
    startingAfter?: string
  ): Promise<InvoiceListResponse> {
    const { stripe, stripeCustomerId } = await this.stripeContext.getStripeContextForUser(userId);
    const normalizedLimit = Math.max(1, Math.min(100, Math.floor(limit)));
    const normalizedStartingAfter = (startingAfter ?? '').trim();
    const invoices = await stripe.invoices.list({
      customer: stripeCustomerId,
      limit: normalizedLimit,
      starting_after: normalizedStartingAfter || undefined,
    });
    const lastInvoice = invoices.data[invoices.data.length - 1] ?? null;

    return {
      items: invoices.data.map(inv => {
        return {
          id: inv.id,
          number: inv.number ?? inv.id,
          amountCents: inv.amount_due ?? inv.amount_paid ?? 0,
          currency: 'USD',
          status: inv.status ?? 'open',
          issuingDate: inv.created ? new Date(inv.created * 1000).toISOString() : undefined,
          paymentDueDate: inv.due_date ? new Date(inv.due_date * 1000).toISOString() : undefined,
          pdfUrl: inv.invoice_pdf ?? undefined,
        };
      }),
      hasMore: invoices.has_more,
      nextCursor: invoices.has_more && lastInvoice?.id ? lastInvoice.id : undefined,
    };
  }

  /** Returns the default payment method for a user's Stripe customer. */
  async getDefaultPaymentMethod(userId: string): Promise<{
    id: string;
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    isDefault: boolean;
  } | null> {
    const { stripe, stripeCustomerId } = await this.stripeContext.getStripeContextForUser(userId);
    const customer = await stripe.customers.retrieve(stripeCustomerId);
    if (customer.deleted) return null;

    const defaultPmId =
      typeof customer.invoice_settings?.default_payment_method === 'string'
        ? customer.invoice_settings.default_payment_method
        : ((customer.invoice_settings?.default_payment_method as Stripe.PaymentMethod | null)?.id ??
          null);

    if (!defaultPmId) {
      // Fall back to most recent card payment method
      const pms = await stripe.paymentMethods.list({
        customer: stripeCustomerId,
        type: 'card',
        limit: 1,
      });
      const pm = pms.data[0] ?? null;
      if (!pm?.card) return null;
      return {
        id: pm.id,
        brand: pm.card.brand,
        last4: pm.card.last4,
        expMonth: pm.card.exp_month,
        expYear: pm.card.exp_year,
        isDefault: false,
      };
    }

    const pm = await stripe.paymentMethods.retrieve(defaultPmId);
    if (!pm.card) return null;
    return {
      id: pm.id,
      brand: pm.card.brand,
      last4: pm.card.last4,
      expMonth: pm.card.exp_month,
      expYear: pm.card.exp_year,
      isDefault: true,
    };
  }
}
