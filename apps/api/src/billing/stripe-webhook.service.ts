import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import type { Prisma } from '@pytholit/db';
import type Stripe from 'stripe';

import { isPrismaUniqueViolation } from '../common/utils/prisma-error.utils';
import { PrismaService } from '../database/prisma.service';
import { StripeService } from '../stripe/stripe.service';
import { BILLING_ERROR_CODE } from './billing-error-codes';
import { StripeWebhookProcessorService } from './stripe-webhook.processor.service';
import { WebhookQueueService } from './webhook.queue';

@Injectable()
export class StripeWebhookService {
  private readonly logger = new Logger(StripeWebhookService.name);

  constructor(
    private readonly stripeService: StripeService,
    private readonly prisma: PrismaService,
    private readonly queue: WebhookQueueService,
    private readonly processor: StripeWebhookProcessorService
  ) {}

  async receiveWebhook(rawBody: Buffer, signatureHeader: string | undefined): Promise<void> {
    if (!signatureHeader) {
      throw new BadRequestException({
        code: BILLING_ERROR_CODE.STRIPE_WEBHOOK_MISSING_SIGNATURE,
        detail: 'Missing Stripe-Signature header.',
      });
    }

    const stripe = this.stripeService.client();
    const secrets = this.stripeService.webhookSecrets();

    let event: Stripe.Event | null = null;
    try {
      let lastError: unknown = null;
      for (const secret of secrets) {
        try {
          event = stripe.webhooks.constructEvent(rawBody, signatureHeader, secret);
          lastError = null;
          break;
        } catch (err) {
          lastError = err;
        }
      }
      if (lastError) throw lastError;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid signature';
      throw new BadRequestException({
        code: BILLING_ERROR_CODE.STRIPE_WEBHOOK_SIGNATURE_INVALID,
        detail: message,
      });
    }
    if (!event) {
      throw new BadRequestException({
        code: BILLING_ERROR_CODE.STRIPE_WEBHOOK_SIGNATURE_INVALID,
        detail: 'Invalid signature.',
      });
    }

    // Persist first (dedupe by PK), then enqueue for durable processing.
    try {
      await this.prisma.client.stripeWebhookEvent.create({
        data: {
          stripeEventId: event.id,
          eventType: event.type,
          payloadJson: event as unknown as Prisma.InputJsonValue,
          rawBody: Uint8Array.from(rawBody),
          signatureHeader,
          processingStatus: 'received',
        },
        select: { stripeEventId: true },
      });
    } catch (e) {
      if (!isPrismaUniqueViolation(e)) throw e;
    }

    try {
      await this.queue.enqueueStripeWebhookEvent(event.id);
      return;
    } catch (e) {
      const isDev = (process.env.NODE_ENV ?? '') === 'development';
      if (!isDev) {
        // In production, let the error propagate so Stripe retries via its own retry mechanism.
        // Processing inline would hold the HTTP connection open and risk timeouts under load.
        throw e;
      }
      // Local/dev fallback: process inline so webhooks work without Redis.
      this.logger.warn('stripe_webhook_queue_unavailable_processing_inline', {
        stripeEventId: event.id,
        type: event.type,
        error: e instanceof Error ? e.message : String(e),
      });
    }

    await this.processor.processStripeEventAndUpdateStatus(event.id, event, 1000);
  }
}
