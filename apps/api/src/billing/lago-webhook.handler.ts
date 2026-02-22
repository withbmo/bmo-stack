import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@pytholit/db';
import { createHash } from 'crypto';

import { PrismaService } from '../database/prisma.service';
import { BillingFacadeService } from './billing-facade.service';
import type { LagoInvoice, LagoSubscription, LagoWebhookEvent } from './lago.types';

@Injectable()
export class LagoWebhookHandler {
  private readonly logger = new Logger(LagoWebhookHandler.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly billingFacade: BillingFacadeService
  ) {}

  async handleWebhook(event: LagoWebhookEvent): Promise<void> {
    const eventId = this.resolveEventId(event);
    if (eventId) {
      const isNewEvent = await this.markLagoEventAsProcessed(
        eventId,
        event.type,
        this.resolveUserId(event)
      );

      if (!isNewEvent) {
        this.logger.log(`Duplicate Lago webhook event skipped: ${eventId} (${event.type})`);
        return;
      }
    }

    switch (event.type) {
      case 'subscription.created':
      case 'subscription.started':
      case 'subscription.updated':
      case 'subscription.resumed':
      case 'subscription.renewed':
        await this.handleSubscriptionUpsert(event.data);
        return;

      case 'invoice.paid':
        await this.handleInvoicePaid(event.data);
        return;

      case 'invoice.payment_failed':
        await this.handleInvoiceFailed(event.data);
        return;

      case 'subscription.terminated':
      case 'subscription.canceled':
      case 'subscription.cancelled':
        await this.handleSubscriptionTerminated(event.data);
        return;

      default:
        this.logger.log(`Unhandled Lago webhook event: ${event.type}`);
    }
  }

  private async handleInvoicePaid(data: unknown): Promise<void> {
    const invoice = this.extractInvoice(data);
    if (!invoice?.lago_id) {
      this.logger.warn('Lago invoice paid event missing invoice id');
      return;
    }
    const result = await this.billingFacade.processPaidInvoiceTopup(invoice.lago_id);
    this.logger.log(`Lago invoice paid: ${invoice.lago_id} (${result})`);
  }

  private async handleInvoiceFailed(data: unknown): Promise<void> {
    const invoice = this.extractInvoice(data);
    if (!invoice?.lago_id) {
      this.logger.warn('Lago invoice failure event missing invoice id');
      return;
    }
    const request = await this.prisma.client.creditTopupRequest.findUnique({
      where: { lagoInvoiceId: invoice.lago_id },
      select: { id: true, status: true },
    });
    if (request && request.status !== 'succeeded') {
      await this.prisma.client.creditTopupRequest.update({
        where: { id: request.id },
        data: { status: 'failed' },
      });
    }

    const eventData = data as Record<string, unknown> | undefined;
    const externalCustomerId =
      (typeof eventData?.external_customer_id === 'string' && eventData.external_customer_id) ||
      (typeof (eventData?.invoice as Record<string, unknown> | undefined)?.external_customer_id ===
        'string' &&
        ((eventData?.invoice as Record<string, unknown>).external_customer_id as string)) ||
      null;

    if (externalCustomerId) {
      await this.prisma.client.subscription.updateMany({
        where: {
          userId: externalCustomerId,
          status: { in: ['active', 'trialing', 'past_due'] },
        },
        data: {
          status: 'past_due',
          featureAccessState: 'locked_due_to_payment',
        },
      });
    }

    this.logger.warn(`Lago invoice payment failed: ${invoice.lago_id}`);
  }

  private extractInvoice(data: unknown): LagoInvoice | null {
    if (!data || typeof data !== 'object') return null;
    const direct = data as Record<string, unknown>;
    if (typeof direct.lago_id === 'string') {
      return direct as LagoInvoice;
    }
    const nested = direct.invoice;
    if (nested && typeof nested === 'object' && typeof (nested as any).lago_id === 'string') {
      return nested as LagoInvoice;
    }
    return null;
  }

  private async handleSubscriptionUpsert(data: unknown): Promise<void> {
    const subscription = this.extractSubscription(data);
    if (!subscription?.lago_id || !subscription.external_customer_id) {
      this.logger.warn('Lago subscription event missing required identifiers; skipping projection sync');
      return;
    }

    await this.upsertSubscriptionProjection(subscription, subscription.status, false);
    this.logger.log(`Lago subscription synced: ${subscription.lago_id} (${subscription.status})`);
  }

  private async handleSubscriptionTerminated(data: unknown): Promise<void> {
    const subscription = this.extractSubscription(data);
    if (!subscription?.lago_id || !subscription.external_customer_id) {
      this.logger.warn(
        'Lago subscription termination event missing required identifiers; skipping projection sync'
      );
      return;
    }

    await this.upsertSubscriptionProjection(subscription, 'canceled', true);
    this.logger.log(`Lago subscription terminated: ${subscription.lago_id}`);
  }

  private extractSubscription(data: unknown): LagoSubscription | null {
    if (!data || typeof data !== 'object') return null;

    const direct = data as Record<string, unknown>;
    if (typeof direct.plan_code === 'string' && typeof direct.external_customer_id === 'string') {
      return direct as unknown as LagoSubscription;
    }

    const nested = direct.subscription;
    if (
      nested &&
      typeof nested === 'object' &&
      typeof (nested as Record<string, unknown>).plan_code === 'string' &&
      typeof (nested as Record<string, unknown>).external_customer_id === 'string'
    ) {
      return nested as LagoSubscription;
    }

    return null;
  }

  private extractPlanIdFromCode(planCode: string): string {
    const parts = planCode.split('_');
    return parts.slice(0, -1).join('_') || planCode;
  }

  private async upsertSubscriptionProjection(
    subscription: LagoSubscription,
    status: string,
    cancelAtPeriodEnd: boolean
  ): Promise<void> {
    const now = new Date();
    const currentPeriodStart = subscription.current_period_start
      ? new Date(subscription.current_period_start)
      : now;
    const currentPeriodEnd = subscription.current_period_end
      ? new Date(subscription.current_period_end)
      : now;

    const billingInterval = subscription.plan_code.endsWith('_yearly') ? 'year' : 'month';
    const featureAccessState =
      status === 'past_due' || status === 'unpaid' ? 'locked_due_to_payment' : 'enabled';

    await this.prisma.client.subscription.upsert({
      where: {
        externalSubscriptionId: subscription.lago_id,
      },
      create: {
        userId: subscription.external_customer_id,
        planId: this.extractPlanIdFromCode(subscription.plan_code),
        status,
        billingInterval,
        featureAccessState,
        externalSubscriptionId: subscription.lago_id,
        currentPeriodStart,
        currentPeriodEnd,
        cancelAtPeriodEnd,
      },
      update: {
        userId: subscription.external_customer_id,
        planId: this.extractPlanIdFromCode(subscription.plan_code),
        status,
        billingInterval,
        featureAccessState,
        currentPeriodStart,
        currentPeriodEnd,
        cancelAtPeriodEnd,
      },
    });
  }

  private resolveEventId(event: LagoWebhookEvent): string | null {
    if (event.id) return event.id;
    if (event.lago_id) return event.lago_id;

    const data = event.data as Record<string, unknown> | undefined;
    const resourceId = this.resolveResourceId(data);
    const providerCreatedAt = this.resolveProviderCreatedAt(event, data);
    const fingerprint = createHash('sha256')
      .update(JSON.stringify(event.data ?? {}))
      .digest('hex')
      .slice(0, 16);
    return `${event.type}:${providerCreatedAt}:${resourceId}:${fingerprint}`;
  }

  private resolveResourceId(data?: Record<string, unknown>): string {
    if (!data) return 'unknown-resource';
    const directLagoId = data.lago_id;
    if (typeof directLagoId === 'string' && directLagoId.length > 0) return directLagoId;

    const nestedSubscription = data.subscription as Record<string, unknown> | undefined;
    const nestedInvoice = data.invoice as Record<string, unknown> | undefined;
    const nestedId = nestedSubscription?.lago_id ?? nestedInvoice?.lago_id;
    if (typeof nestedId === 'string' && nestedId.length > 0) return nestedId;
    return 'unknown-resource';
  }

  private resolveProviderCreatedAt(
    event: LagoWebhookEvent,
    data?: Record<string, unknown>
  ): string {
    const direct = (event as unknown as Record<string, unknown>).created_at;
    if (typeof direct === 'string' && direct.length > 0) return direct;
    if (typeof direct === 'number' && Number.isFinite(direct)) return String(direct);

    const fromData = data?.created_at;
    if (typeof fromData === 'string' && fromData.length > 0) return fromData;
    if (typeof fromData === 'number' && Number.isFinite(fromData)) return String(fromData);

    return 'unknown-time';
  }

  private resolveUserId(event: LagoWebhookEvent): string | null {
    const data = event.data as Record<string, unknown> | undefined;
    if (!data) return null;

    const externalCustomerId = data.external_customer_id;
    if (typeof externalCustomerId === 'string' && externalCustomerId.length > 0) {
      return externalCustomerId;
    }

    const nestedSubscription = data.subscription as Record<string, unknown> | undefined;
    const nestedInvoice = data.invoice as Record<string, unknown> | undefined;
    const nestedExternalCustomerId =
      nestedSubscription?.external_customer_id ?? nestedInvoice?.external_customer_id;
    return typeof nestedExternalCustomerId === 'string' && nestedExternalCustomerId.length > 0
      ? nestedExternalCustomerId
      : null;
  }

  private async markLagoEventAsProcessed(
    id: string,
    type: string,
    userId: string | null
  ): Promise<boolean> {
    try {
      await this.prisma.client.lagoWebhookEvent.create({
        data: {
          id,
          type,
          userId,
        },
      });
      return true;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        return false;
      }
      throw err;
    }
  }
}
