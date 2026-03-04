import { Injectable } from '@nestjs/common';
import type Stripe from 'stripe';

import { PrismaService } from '../../database/prisma.service';
import { StripeService } from '../../stripe/stripe.service';
import type { PageResult } from '../types/page-result';

export type AdminSubscriptionRow = {
  id: string;
  userId: string;
  billingAccountId: string;
  planId: string | null;
  status: string;
  engineSubscriptionExternalId: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
};

export type AdminInvoiceRow = {
  id: string;
  userId: string;
  externalInvoiceId: string;
  amount: number;
  currency: string;
  status: string;
  invoiceUrl: string | null;
  pdfUrl: string | null;
  createdAt: string;
};

function toPlanId(planCode: string): string | null {
  if (planCode.startsWith('pro_')) return 'pro';
  if (planCode.startsWith('max_')) return 'max';
  if (planCode.startsWith('free_')) return 'free';
  return null;
}

@Injectable()
export class AdminBillingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService
  ) { }

  async listSubscriptions(params: {
    page?: number;
    pageSize?: number;
  }): Promise<PageResult<AdminSubscriptionRow>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 25;
    const offset = (page - 1) * pageSize;

    const total = await this.prisma.client.billingEngineState.count();
    const subs = await this.prisma.client.billingEngineState.findMany({
      orderBy: { updatedAt: 'desc' },
      skip: offset,
      take: pageSize,
      select: {
        userId: true,
        planCode: true,
        accessState: true,
        engineSubscriptionExternalId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      items: subs.map((s) => ({
        id: s.engineSubscriptionExternalId,
        userId: s.userId,
        billingAccountId: s.userId,
        planId: toPlanId(s.planCode),
        status: s.accessState,
        engineSubscriptionExternalId: s.engineSubscriptionExternalId,
        currentPeriodStart: s.createdAt.toISOString(),
        currentPeriodEnd: s.updatedAt.toISOString(),
        cancelAtPeriodEnd: false,
      })),
      total,
      page,
      pageSize,
    };
  }

  async listInvoices(params: {
    page?: number;
    pageSize?: number;
  }): Promise<PageResult<AdminInvoiceRow>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 25;
    const stripe = this.stripeService.client();

    let startingAfter: string | undefined;
    let pageRes: Stripe.ApiList<Stripe.Invoice> | null = null;

    for (let i = 0; i < page; i += 1) {
      pageRes = await stripe.invoices.list({
        limit: pageSize,
        ...(startingAfter ? { starting_after: startingAfter } : {}),
      });
      if (!pageRes.has_more) break;
      const last = pageRes.data[pageRes.data.length - 1]?.id;
      if (!last) break;
      startingAfter = last;
    }

    const invs = pageRes?.data ?? [];
    const customerIds = invs
      .map((inv) => (typeof inv.customer === 'string' ? inv.customer : inv.customer?.id ?? null))
      .filter((v): v is string => typeof v === 'string' && v.length > 0);

    const users = await this.prisma.client.user.findMany({
      where: { stripeCustomerId: { in: customerIds } },
      select: { id: true, stripeCustomerId: true },
    });
    const userByCustomerId = new Map(users.map((u) => [u.stripeCustomerId!, u.id]));

    const total = (page - 1) * pageSize + invs.length + ((pageRes?.has_more ?? false) ? 1 : 0);

    return {
      items: invs.map((i) => ({
        id: i.id,
        userId: (typeof i.customer === 'string' ? userByCustomerId.get(i.customer) : undefined) ?? 'unknown',
        externalInvoiceId: i.id,
        amount: i.amount_due ?? i.amount_paid ?? 0,
        currency: (i.currency ?? 'usd').toUpperCase(),
        status: i.status ?? 'draft',
        invoiceUrl: i.hosted_invoice_url ?? null,
        pdfUrl: i.invoice_pdf ?? null,
        createdAt: i.created ? new Date(i.created * 1000).toISOString() : new Date(0).toISOString(),
      })),
      total,
      page,
      pageSize,
    };
  }
}
