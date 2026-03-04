import { Injectable, Logger } from '@nestjs/common';
import type Stripe from 'stripe';

import { PrismaService } from '../database/prisma.service';
import { StripeWebhookProcessorService } from './stripe-webhook.processor.service';

@Injectable()
export class StripeWebhookWorkerService {
  private readonly logger = new Logger(StripeWebhookWorkerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly processor: StripeWebhookProcessorService
  ) {}

  async processStripeEventId(stripeEventId: string): Promise<void> {
    const row = await this.prisma.client.stripeWebhookEvent.findUnique({
      where: { stripeEventId },
      select: {
        stripeEventId: true,
        payloadJson: true,
        processingStatus: true,
        processingAttempts: true,
      },
    });
    if (!row) {
      this.logger.warn('stripe_webhook_event_missing', { stripeEventId });
      return;
    }

    if (row.processingStatus === 'processed') return;

    await this.prisma.client.stripeWebhookEvent.update({
      where: { stripeEventId },
      data: {
        processingStatus: 'queued',
        processingAttempts: { increment: 1 },
        lastError: null,
      },
      select: { stripeEventId: true },
    });

    const event = row.payloadJson as unknown as Stripe.Event;

    await this.processor.processStripeEventAndUpdateStatus(stripeEventId, event, 2000);
  }
}
