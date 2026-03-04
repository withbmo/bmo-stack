import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { BILLING_ERROR_CODE } from './billing-error-codes';
import { BillingJobName } from './billing.constants';
import { StripeWebhookWorkerService } from './stripe-webhook.worker.service';

@Injectable()
export class BillingProcessor {
  private readonly logger = new Logger(BillingProcessor.name);

  constructor(private readonly stripeWebhookWorker: StripeWebhookWorkerService) {}

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
}
