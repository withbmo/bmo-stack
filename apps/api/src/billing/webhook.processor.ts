import { OnWorkerEvent,Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { LagoWebhookHandler } from './lago-webhook.handler';
import type { WebhookJobData } from './webhook.queue';

@Processor('billing-webhooks', {
  concurrency: 5, // Process up to 5 webhooks simultaneously
})
export class WebhookProcessor extends WorkerHost {
  private readonly logger = new Logger(WebhookProcessor.name);

  constructor(private readonly lagoWebhookHandler: LagoWebhookHandler) {
    super();
  }

  async process(job: Job<WebhookJobData>): Promise<void> {
    const { source, event } = job.data;

    this.logger.log(
      `Processing ${source} webhook ${job.id} (attempt ${job.attemptsMade + 1}/${job.opts.attempts})`
    );

    const processingStartTime = Date.now();

    try {
      await this.lagoWebhookHandler.handleWebhook(event);

      const processingTime = Date.now() - processingStartTime;
      this.logger.log(
        `Successfully processed ${source} webhook ${job.id} in ${processingTime}ms`
      );
    } catch (error) {
      const processingTime = Date.now() - processingStartTime;
      this.logger.error(
        `Failed to process ${source} webhook ${job.id} after ${processingTime}ms`,
        error instanceof Error ? error.stack : String(error)
      );
      throw error; // Re-throw to trigger BullMQ retry
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<WebhookJobData>) {
    const { source } = job.data;
    this.logger.debug(`Completed ${source} webhook job ${job.id}`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<WebhookJobData> | undefined, error: Error) {
    if (!job) {
      this.logger.error('Job failed without job data', error.stack);
      return;
    }

    const { event } = job.data;
    const attemptsLeft = (job.opts.attempts || 3) - (job.attemptsMade || 0);

    if (attemptsLeft > 0) {
      this.logger.warn(
        `Webhook job ${job.id} failed, ${attemptsLeft} attempts remaining. Event: ${event.type}`,
        error.message
      );
    } else {
      this.logger.error(
        `Webhook job ${job.id} exhausted all retry attempts. Event: ${event.type}`,
        error.stack
      );
      // TODO: Send alert to monitoring system (Sentry, PagerDuty, etc.)
    }
  }

  @OnWorkerEvent('active')
  onActive(job: Job<WebhookJobData>) {
    this.logger.debug(`Processing ${job.data.source} webhook job ${job.id}`);
  }

  @OnWorkerEvent('stalled')
  onStalled(jobId: string) {
    this.logger.warn(`Webhook job ${jobId} stalled and will be retried`);
  }
}
