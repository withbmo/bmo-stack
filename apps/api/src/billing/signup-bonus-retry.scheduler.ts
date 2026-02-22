import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';

const SIGNUP_BONUS_RETRY_SCHEDULER_ID = 'signup-bonus-retry-scheduler';
const SIGNUP_BONUS_RETRY_JOB_NAME = 'scan-signup-bonus-retry';
const SIGNUP_BONUS_RETRY_EVERY_MS = 5 * 60 * 1000;

@Injectable()
export class SignupBonusRetryScheduler implements OnModuleInit {
  private readonly logger = new Logger(SignupBonusRetryScheduler.name);

  constructor(
    @InjectQueue('billing-signup-bonus-retry')
    private readonly queue: Queue
  ) {}

  async onModuleInit(): Promise<void> {
    await this.queue.upsertJobScheduler(
      SIGNUP_BONUS_RETRY_SCHEDULER_ID,
      {
        every: SIGNUP_BONUS_RETRY_EVERY_MS,
      },
      {
        name: SIGNUP_BONUS_RETRY_JOB_NAME,
        data: {},
        opts: {
          removeOnComplete: {
            count: 20,
          },
          removeOnFail: {
            count: 100,
          },
        },
      }
    );

    this.logger.log('Signup bonus retry scheduler registered (every 5 minutes)');
  }
}
