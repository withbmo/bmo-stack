import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

import type { LagoWebhookEvent } from './lago.types';

export type WebhookJobData = {
  source: 'lago';
  event: LagoWebhookEvent;
  receivedAt: string;
};

@Injectable()
export class WebhookQueue {
  private readonly logger = new Logger(WebhookQueue.name);

  constructor(@InjectQueue('billing-webhooks') private queue: Queue<WebhookJobData>) {}

  /**
   * Queue a Lago webhook for async processing
   */
  async queueLagoWebhook(event: LagoWebhookEvent): Promise<void> {
    const jobId = `lago-${event.lago_id || event.id || Date.now()}`;

    await this.queue.add(
      'lago-webhook',
      {
        source: 'lago',
        event,
        receivedAt: new Date().toISOString(),
      },
      {
        jobId,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000, // Start with 2s, then 4s, then 8s
        },
        removeOnComplete: {
          count: 100, // Keep last 100 successful jobs
          age: 24 * 3600, // Remove after 24 hours
        },
        removeOnFail: {
          count: 500, // Keep last 500 failed jobs for debugging
        },
      }
    );

    this.logger.log(`Queued Lago webhook: ${jobId} (${event.type})`);
  }

  /**
   * Get queue metrics for monitoring
   */
  async getQueueMetrics() {
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      this.queue.getWaitingCount(),
      this.queue.getActiveCount(),
      this.queue.getCompletedCount(),
      this.queue.getFailedCount(),
      this.queue.getDelayedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + delayed,
    };
  }
}
