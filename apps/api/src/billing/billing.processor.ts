import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import type { Job } from 'bullmq';

import { BillingJobName, BillingQueue } from './billing.constants';
import { BILLING_ERROR_CODE } from './billing-error-codes';
import { StripeWebhookWorkerService } from './stripe-webhook.worker.service';

@Processor(BillingQueue.Name, { concurrency: 10 })
export class BillingProcessor extends WorkerHost {
  private readonly logger = new Logger(BillingProcessor.name);

  constructor(private readonly stripeWebhookWorker: StripeWebhookWorkerService) {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case BillingJobName.StripeWebhookEvent: {
        const stripeEventId = (job.data as { stripeEventId?: unknown })?.stripeEventId;
        if (typeof stripeEventId !== 'string' || stripeEventId.length === 0) {
          throw new BadRequestException({
            code: BILLING_ERROR_CODE.BILLING_JOB_INVALID_PAYLOAD,
            detail: 'stripeEventId is required.',
          });
        }
        await this.stripeWebhookWorker.processStripeEventId(stripeEventId);
        return;
      }

      default: {
        this.logger.warn('unknown_job', { name: job.name });
      }
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job | undefined, error: Error): void {
    this.logger.error('billing_worker_failed', {
      jobId: job?.id,
      name: job?.name,
      attemptsMade: job?.attemptsMade,
      error: error.message,
    });
  }
}
