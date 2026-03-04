import { Injectable, Logger } from '@nestjs/common';
import { AfterHook, type AuthHookContext, Hook } from '@thallesp/nestjs-better-auth';

import { StripeCustomerService } from '../../billing/stripe-customer.service';
import { PrismaService } from '../../database/prisma.service';

@Hook()
@Injectable()
export class AuthEventsHook {
  private readonly logger = new Logger(AuthEventsHook.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeCustomers: StripeCustomerService
  ) {}

  @AfterHook('/verify-email')
  async onVerifyEmail(ctx: AuthHookContext): Promise<void> {
    await this.tryProvisionBillingCustomer(ctx, 'verify-email');
  }

  @AfterHook('/email-otp/verify-email')
  async onOtpVerifyEmail(ctx: AuthHookContext): Promise<void> {
    await this.tryProvisionBillingCustomer(ctx, 'otp-verify-email');
  }

  @AfterHook('/callback/google')
  async onGoogleCallback(ctx: AuthHookContext): Promise<void> {
    await this.tryProvisionBillingCustomer(ctx, 'oauth-google-callback');
  }

  @AfterHook('/callback/github')
  async onGithubCallback(ctx: AuthHookContext): Promise<void> {
    await this.tryProvisionBillingCustomer(ctx, 'oauth-github-callback');
  }

  private async tryProvisionBillingCustomer(ctx: AuthHookContext, source: string): Promise<void> {
    const userId = this.extractUserId(ctx);
    if (!userId) {
      this.logger.warn(`billing_provision_skipped source=${source} reason=no_user_id`);
      return;
    }

    try {
      const user = await this.prisma.client.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (!user?.email) {
        this.logger.warn(`billing_provision_skipped source=${source} userId=${userId} reason=no_email`);
        return;
      }

      await this.stripeCustomers.getOrCreateStripeCustomerIdForUser(userId);
      this.logger.log(`billing_customer_provisioned source=${source} userId=${userId}`);
    } catch (err) {
      // Non-fatal: log and continue — idempotent on retry
      this.logger.error(`billing_provision_failed source=${source} userId=${userId}`, err);
    }
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
