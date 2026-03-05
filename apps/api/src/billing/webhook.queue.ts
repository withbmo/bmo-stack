import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';

import { BillingJobName, BillingQueue } from './billing.constants';

@Injectable()
export class WebhookQueueService {
  constructor(@InjectQueue(BillingQueue.Name) private readonly queue: Queue) {}

  async enqueueStripeWebhookEvent(stripeEventId: string): Promise<void> {
    try {
      await this.queue.add(
        BillingJobName.StripeWebhookEvent,
        { stripeEventId },
        {
          jobId: stripeEventId,
          attempts: 8,
          backoff: { type: 'exponential', delay: 1000 },
        }
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      // Stripe can retry the same event many times; BullMQ will reject duplicate jobIds while the job exists.
      if (message.toLowerCase().includes('job') && message.toLowerCase().includes('exists')) return;
      throw err;
    }
  }
}
