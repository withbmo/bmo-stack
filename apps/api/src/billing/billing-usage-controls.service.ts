import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@pytholit/db';

import { PrismaService } from '../database/prisma.service';
import { isPrismaUniqueViolation } from '../common/utils/prisma-error.utils';
import { BILLING_ERROR_CODE } from './billing-error-codes';
import { BILLABLE_EVENTS, type BillableEvent } from './billing.interface';
import { UpdateUsageSettingsDto } from './dto/update-usage-settings.dto';

type UsageEventView = {
  eventName: BillableEvent;
  label: string;
  consumedCredits: number;
  maxCredits: number | null;
  unlimited: boolean;
};

const EVENT_LABELS: Record<BillableEvent, string> = {
  ai_tokens: 'AI Tokens',
  ec2_minutes: 'Compute Minutes',
  nat_gb: 'NAT Egress',
};

function startOfMonthUtc(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 0, 0, 0, 0));
}

@Injectable()
export class BillingUsageControlsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsageSettingsForUser(userId: string): Promise<{
    currentCredits: number;
    currency: 'USD';
    periodStart: string;
    events: UsageEventView[];
  }> {
    const periodStart = startOfMonthUtc(new Date());
    const [limits, aggregates, currentCredits] = await Promise.all([
      this.prisma.client.billingUsageLimit.findMany({
        where: { userId },
        select: { eventName: true, maxCredits: true },
      }),
      this.prisma.client.billingUsageAggregate.findMany({
        where: { userId, periodStart },
        select: { eventName: true, consumedCredits: true },
      }),
      this.getCurrentCredits(userId),
    ]);
    const limitByEvent = new Map(limits.map(item => [item.eventName, item.maxCredits] as const));
    const consumedByEvent = new Map(
      aggregates.map(item => [item.eventName, item.consumedCredits] as const)
    );
    const events = BILLABLE_EVENTS.map(eventName => {
      const maxCredits = limitByEvent.get(eventName) ?? null;
      return {
        eventName,
        label: EVENT_LABELS[eventName],
        consumedCredits: consumedByEvent.get(eventName) ?? 0,
        maxCredits,
        unlimited: maxCredits === null,
      };
    });

    return {
      currentCredits,
      currency: 'USD',
      periodStart: periodStart.toISOString(),
      events,
    };
  }

  async updateUsageSettingsForUser(
    userId: string,
    input: UpdateUsageSettingsDto
  ): Promise<{
    currentCredits: number;
    currency: 'USD';
    periodStart: string;
    events: UsageEventView[];
  }> {
    const uniqueEventNames = new Set(input.events.map(item => item.eventName));
    if (uniqueEventNames.size !== input.events.length) {
      throw new BadRequestException({
        code: BILLING_ERROR_CODE.BILLING_USAGE_SETTINGS_INVALID,
        detail: 'Duplicate eventName entries are not allowed.',
      });
    }

    await this.prisma.client.$transaction(
      input.events.map(item => {
        const maxCredits = item.unlimited ? null : (item.maxCredits ?? 0);
        return this.prisma.client.billingUsageLimit.upsert({
          where: {
            userId_eventName: { userId, eventName: item.eventName },
          },
          create: { userId, eventName: item.eventName, maxCredits },
          update: { maxCredits },
          select: { eventName: true },
        });
      }),
      { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted }
    );

    return this.getUsageSettingsForUser(userId);
  }

  async isUsageAlreadyRecorded(idempotencyKey: string): Promise<boolean> {
    const existing = await this.prisma.client.billingUsageReport.findUnique({
      where: { idempotencyKey },
      select: { idempotencyKey: true },
    });
    return Boolean(existing?.idempotencyKey);
  }

  async assertCanConsumeUsage(
    userId: string,
    eventName: BillableEvent,
    consumedCredits: number,
    occurredAt = new Date()
  ): Promise<void> {
    const limitRow = await this.prisma.client.billingUsageLimit.findUnique({
      where: { userId_eventName: { userId, eventName } },
      select: { maxCredits: true },
    });
    const maxCredits = limitRow?.maxCredits ?? null;
    if (maxCredits === null) return;

    const periodStart = startOfMonthUtc(occurredAt);
    const aggregate = await this.prisma.client.billingUsageAggregate.findUnique({
      where: { userId_eventName_periodStart: { userId, eventName, periodStart } },
      select: { consumedCredits: true },
    });
    const currentConsumed = aggregate?.consumedCredits ?? 0;
    if (currentConsumed + consumedCredits <= maxCredits) return;

    throw new BadRequestException({
      code: BILLING_ERROR_CODE.BILLING_USAGE_LIMIT_EXCEEDED,
      detail: `Usage limit reached for ${eventName}: max=${maxCredits}, current=${currentConsumed}, requested=${consumedCredits}.`,
    });
  }

  async recordUsageIfNew(input: {
    userId: string;
    eventName: BillableEvent;
    consumedCredits: number;
    idempotencyKey: string;
    occurredAt: Date;
  }): Promise<boolean> {
    const periodStart = startOfMonthUtc(input.occurredAt);
    try {
      await this.prisma.client.$transaction(async tx => {
        await tx.billingUsageReport.create({
          data: {
            idempotencyKey: input.idempotencyKey,
            userId: input.userId,
            eventName: input.eventName,
            consumedCredits: input.consumedCredits,
            occurredAt: input.occurredAt,
          },
          select: { idempotencyKey: true },
        });
        await tx.billingUsageAggregate.upsert({
          where: {
            userId_eventName_periodStart: {
              userId: input.userId,
              eventName: input.eventName,
              periodStart,
            },
          },
          create: {
            userId: input.userId,
            eventName: input.eventName,
            periodStart,
            consumedCredits: input.consumedCredits,
          },
          update: {
            consumedCredits: { increment: input.consumedCredits },
          },
          select: { userId: true },
        });
      });
      return true;
    } catch (err) {
      if (isPrismaUniqueViolation(err)) return false;
      throw err;
    }
  }

  async addCredits(userId: string, credits: number): Promise<void> {
    if (!Number.isFinite(credits) || credits <= 0) return;
    await this.prisma.client.user.update({
      where: { id: userId },
      data: { currentCredits: { increment: Math.round(credits) } },
      select: { id: true },
    });
  }

  async deductCredits(userId: string, credits: number): Promise<void> {
    const normalized = Math.max(0, Math.round(Number(credits)));
    if (normalized <= 0) return;
    const updated = await this.prisma.client.user.updateMany({
      where: { id: userId, currentCredits: { gte: normalized } },
      data: { currentCredits: { decrement: normalized } },
    });
    if (updated.count > 0) return;

    throw new BadRequestException({
      code: BILLING_ERROR_CODE.BILLING_USAGE_LIMIT_EXCEEDED,
      detail: 'Insufficient credits.',
    });
  }

  private async getCurrentCredits(userId: string): Promise<number> {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: { currentCredits: true },
    });
    return Math.max(0, user?.currentCredits ?? 0);
  }

}
