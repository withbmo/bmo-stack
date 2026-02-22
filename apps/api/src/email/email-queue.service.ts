import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Job, Queue, Worker } from 'bullmq';

import {
  EMAIL_JOB_ATTEMPTS,
  EMAIL_JOB_BACKOFF_DELAY_MS,
  EmailJobName,
  EmailQueue,
} from './email.constants';
import { EmailConfigService } from './email.config';
import { EmailProcessor } from './email.processor';
import { parseEmailJobPayload } from './email.schemas';
import type { EmailJobPayload } from './email.types';

@Injectable()
export class EmailQueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EmailQueueService.name);
  private queue: Queue<EmailJobPayload> | undefined;
  private worker: Worker<EmailJobPayload> | undefined;

  constructor(
    private readonly configService: EmailConfigService,
    private readonly processor: EmailProcessor,
  ) {}

  async onModuleInit(): Promise<void> {
    if (!this.configService.runtime.queueEnabled) {
      this.logger.warn('Email queue is disabled because REDIS_URL is not configured.');
      return;
    }

    const connection = { url: this.configService.runtime.redisUrl };

    this.queue = new Queue<EmailJobPayload>(EmailQueue.Name, {
      connection,
      defaultJobOptions: {
        attempts: EMAIL_JOB_ATTEMPTS,
        backoff: {
          type: 'exponential',
          delay: EMAIL_JOB_BACKOFF_DELAY_MS,
        },
        removeOnComplete: this.configService.runtime.queueRemoveOnComplete,
        removeOnFail: this.configService.runtime.queueRemoveOnFail,
      },
    });
    this.worker = new Worker<EmailJobPayload>(
      EmailQueue.Name,
      async (job: Job<EmailJobPayload>) => this.processor.process(job),
      {
        connection,
        concurrency: this.configService.runtime.queueConcurrency,
        limiter: {
          max: this.configService.runtime.queueRateLimitMax,
          duration: this.configService.runtime.queueRateLimitDurationMs,
        },
      },
    );

    this.worker.on('failed', (job, error) => {
      this.logger.error('Email worker failed a job', {
        jobId: job?.id,
        attemptsMade: job?.attemptsMade,
        error: error.message,
      });
    });

    this.worker.on('completed', (job) => {
      this.logger.debug('Email worker completed a job', { jobId: job.id });
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

  async enqueue(payload: EmailJobPayload): Promise<void> {
    if (!this.queue) {
      throw new Error('Email queue is not initialized. Configure REDIS_URL to enable queue delivery.');
    }

    const validatedPayload = parseEmailJobPayload(payload);

    await this.queue.add(EmailJobName.Send, validatedPayload, {
      jobId: validatedPayload.idempotencyKey,
    });
  }

  isEnabled(): boolean {
    return this.configService.runtime.queueEnabled;
  }
}
