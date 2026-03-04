import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job, Queue, Worker } from 'bullmq';

import { BillingJobName, BillingQueue } from './billing.constants';
import { BillingProcessor } from './billing.processor';
import { BILLING_ERROR_CODE } from './billing-error-codes';

@Injectable()
export class WebhookQueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WebhookQueueService.name);
  private queue: Queue | undefined;
  private worker: Worker | undefined;

  constructor(
    private readonly configService: ConfigService,
    private readonly processor: BillingProcessor
  ) {}

  async onModuleInit(): Promise<void> {
    const redisUrl = (this.configService.get<string>('REDIS_URL') ?? '').trim();
    if (!redisUrl) {
      this.logger.warn('Billing queue is disabled because REDIS_URL is not configured.');
      return;
    }

    const connection = { url: redisUrl };

    this.queue = new Queue(BillingQueue.Name, {
      connection,
      defaultJobOptions: {
        attempts: 8,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: { count: 1000, age: 24 * 3600 },
        removeOnFail: { count: 5000 },
      },
    });

    this.worker = new Worker(BillingQueue.Name, async (job: Job) => this.processor.process(job), {
      connection,
      concurrency: 10,
    });

    this.worker.on('failed', (job, error) => {
      this.logger.error('billing_worker_failed', {
        jobId: job?.id,
        name: job?.name,
        attemptsMade: job?.attemptsMade,
        error: error.message,
      });
    });
  }

  async onModuleDestroy(): Promise<void> {
    if (this.worker) {
      await this.worker.close();
      this.worker = undefined;
    }
    if (this.queue) {
      await this.queue.close();
      this.queue = undefined;
    }
  }

  async enqueueStripeWebhookEvent(stripeEventId: string): Promise<void> {
    if (!this.queue) {
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.BILLING_QUEUE_NOT_INITIALIZED,
        detail:
          'Billing queue is not initialized. Configure REDIS_URL to enable webhook processing.',
      });
    }

    try {
      await this.queue.add(
        BillingJobName.StripeWebhookEvent,
        { stripeEventId },
        { jobId: stripeEventId }
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      // Stripe can retry the same event many times; BullMQ will reject duplicate jobIds while the job exists.
      if (message.toLowerCase().includes('job') && message.toLowerCase().includes('exists')) return;
      throw err;
    }
  }
}
