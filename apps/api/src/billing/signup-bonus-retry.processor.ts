import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { PrismaService } from '../database/prisma.service';
import { SignupCreditsService } from './signup-credits.service';

const SIGNUP_BONUS_RETRY_JOB_NAME = 'scan-signup-bonus-retry';
const SIGNUP_BONUS_RETRY_BATCH_SIZE = 100;

@Processor('billing-signup-bonus-retry', {
  concurrency: 1,
})
export class SignupBonusRetryProcessor extends WorkerHost {
  private readonly logger = new Logger(SignupBonusRetryProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly signupCredits: SignupCreditsService
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    if (job.name !== SIGNUP_BONUS_RETRY_JOB_NAME) {
      this.logger.debug(`Ignoring unknown signup bonus retry job: ${job.name}`);
      return;
    }

    const eligibleUsers = await this.prisma.client.user.findMany({
      where: {
        isEmailVerified: true,
        signupBonusGrantedAt: null,
      },
      select: {
        id: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: SIGNUP_BONUS_RETRY_BATCH_SIZE,
    });

    if (eligibleUsers.length === 0) {
      this.logger.debug('signup_bonus_retry_scan no_eligible_users');
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const user of eligibleUsers) {
      try {
        await this.signupCredits.grantSignupBonusIfEligible(user.id);
        successCount += 1;
      } catch {
        failCount += 1;
      }
    }

    this.logger.log(
      `signup_bonus_retry_scan_done scanned=${eligibleUsers.length} granted=${successCount} failed=${failCount}`
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job | undefined, error: Error) {
    if (!job) {
      this.logger.error('Signup bonus retry job failed without job metadata', error.stack);
      return;
    }
    this.logger.error(`Signup bonus retry job failed: ${job.id}`, error.stack);
  }
}
