import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';
import { BillingConfigService } from './billing.config';
import { LagoService } from './lago.service';

const SIGNUP_BONUS_CREDITS = 200;

@Injectable()
export class SignupCreditsService {
  private readonly logger = new Logger(SignupCreditsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly lago: LagoService,
    private readonly billingConfig: BillingConfigService
  ) {}

  async grantSignupBonusIfEligible(userId: string): Promise<void> {
    if (!this.billingConfig.lagoEnabled) {
      this.logger.debug(`signup_bonus_grant_skipped lago_disabled userId=${userId}`);
      return;
    }

    const claimAt = new Date();

    const claim = await this.prisma.client.user.updateMany({
      where: {
        id: userId,
        isEmailVerified: true,
        signupBonusGrantedAt: null,
      },
      data: {
        signupBonusGrantedAt: claimAt,
      },
    });

    if (claim.count === 0) {
      this.logger.debug(`signup_bonus_grant_skipped not_eligible userId=${userId}`);
      return;
    }

    this.logger.log(`signup_bonus_grant_started userId=${userId} credits=${SIGNUP_BONUS_CREDITS}`);

    try {
      await this.lago.createCustomer(userId);
      const wallet = await this.lago.getWallet(userId);
      if (wallet) {
        await this.lago.topUpWallet(wallet.lago_id, SIGNUP_BONUS_CREDITS);
      } else {
        await this.lago.createWallet(userId, SIGNUP_BONUS_CREDITS);
      }
      this.logger.log(`signup_bonus_grant_succeeded userId=${userId} credits=${SIGNUP_BONUS_CREDITS}`);
    } catch (error) {
      await this.prisma.client.user.updateMany({
        where: {
          id: userId,
          signupBonusGrantedAt: claimAt,
        },
        data: {
          signupBonusGrantedAt: null,
        },
      });

      this.logger.error(
        `signup_bonus_grant_failed userId=${userId}`,
        error instanceof Error ? error.stack : String(error)
      );
      throw error;
    }
  }
}
