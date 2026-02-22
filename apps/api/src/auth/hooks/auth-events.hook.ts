import { Injectable, Logger } from '@nestjs/common';
import { AfterHook, type AuthHookContext, Hook } from '@thallesp/nestjs-better-auth';

import { SignupCreditsService } from '../../billing/signup-credits.service';

@Hook()
@Injectable()
export class AuthEventsHook {
  private readonly logger = new Logger(AuthEventsHook.name);

  constructor(private readonly signupCredits: SignupCreditsService) {}

  @AfterHook('/verify-email')
  async onVerifyEmail(ctx: AuthHookContext): Promise<void> {
    await this.tryGrantSignupBonus(ctx, 'verify-email');
  }

  @AfterHook('/callback/google')
  async onGoogleCallback(ctx: AuthHookContext): Promise<void> {
    await this.tryGrantSignupBonus(ctx, 'oauth-google-callback');
  }

  @AfterHook('/callback/github')
  async onGithubCallback(ctx: AuthHookContext): Promise<void> {
    await this.tryGrantSignupBonus(ctx, 'oauth-github-callback');
  }

  private async tryGrantSignupBonus(ctx: AuthHookContext, source: string): Promise<void> {
    const userId = this.extractUserId(ctx);
    if (!userId) {
      this.logger.debug(`signup_bonus_hook_skipped no_user_id source=${source}`);
      return;
    }

    void this.signupCredits.grantSignupBonusIfEligible(userId).catch((error) => {
      this.logger.warn(
        `signup_bonus_hook_failed source=${source} userId=${userId} reason=${
          error instanceof Error ? error.message : String(error)
        }`
      );
    });
  }

  private extractUserId(ctx: AuthHookContext): string | null {
    const root = this.asRecord(ctx);
    if (!root) return null;

    const fromNewSession = this.getUserIdFromContainer(root.newSession);
    if (fromNewSession) return fromNewSession;

    const fromSession = this.getUserIdFromContainer(root.session);
    if (fromSession) return fromSession;

    const returned = this.asRecord(root.returned);
    if (!returned) return null;

    const fromReturnedUser = this.getUserIdFromContainer(returned);
    if (fromReturnedUser) return fromReturnedUser;

    return this.toNonEmptyString(returned.id);
  }

  private getUserIdFromContainer(container: unknown): string | null {
    const record = this.asRecord(container);
    if (!record) return null;
    const user = this.asRecord(record.user);
    if (!user) return null;
    return this.toNonEmptyString(user.id);
  }

  private asRecord(value: unknown): Record<string, unknown> | null {
    return value && typeof value === 'object' ? (value as Record<string, unknown>) : null;
  }

  private toNonEmptyString(value: unknown): string | null {
    return typeof value === 'string' && value.length > 0 ? value : null;
  }
}
