import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import type { PageResult } from '../types/page-result';

export type AdminSubscriptionRow = {
  id: string;
  userId: string;
  planId: string | null;
  status: string;
  externalSubscriptionId: string;
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

@Injectable()
export class AdminBillingService {
  constructor(private readonly prisma: PrismaService) {}

  async listSubscriptions(params: {
    page?: number;
    pageSize?: number;
  }): Promise<PageResult<AdminSubscriptionRow>> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 25;
    const [total, subs] = await this.prisma.client.$transaction([
      this.prisma.client.subscription.count(),
      this.prisma.client.subscription.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      items: subs.map((s) => ({
        id: s.id,
        userId: s.userId,
        planId: s.planId ?? null,
        status: s.status,
        externalSubscriptionId: s.externalSubscriptionId,
        currentPeriodStart: s.currentPeriodStart.toISOString(),
        currentPeriodEnd: s.currentPeriodEnd.toISOString(),
        cancelAtPeriodEnd: s.cancelAtPeriodEnd,
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
    const [total, invs] = await this.prisma.client.$transaction([
      this.prisma.client.invoice.count(),
      this.prisma.client.invoice.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      items: invs.map((i) => ({
        id: i.id,
        userId: i.userId,
        externalInvoiceId: i.externalInvoiceId,
        amount: i.amount,
        currency: i.currency,
        status: i.status,
        invoiceUrl: i.invoiceUrl ?? null,
        pdfUrl: i.pdfUrl ?? null,
        createdAt: i.createdAt.toISOString(),
      })),
      total,
      page,
      pageSize,
    };
  }
}
