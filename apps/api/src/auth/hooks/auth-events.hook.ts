import { Injectable, Logger } from '@nestjs/common';
import { AfterHook, type AuthHookContext, Hook } from '@thallesp/nestjs-better-auth';

import { PrismaService } from '../../database/prisma.service.js';

@Hook()
@Injectable()
export class AuthEventsHook {
  private readonly logger = new Logger(AuthEventsHook.name);

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  @AfterHook('/verify-email')
  async onVerifyEmail(ctx: AuthHookContext): Promise<void> {
    await this.tryHydrateUserNamesFromAuthContext(ctx, 'verify-email');
  }

  @AfterHook('/email-otp/verify-email')
  async onOtpVerifyEmail(ctx: AuthHookContext): Promise<void> {
    await this.tryHydrateUserNamesFromAuthContext(ctx, 'otp-verify-email');
  }

  @AfterHook('/callback/google')
  async onGoogleCallback(ctx: AuthHookContext): Promise<void> {
    await this.tryHydrateUserNamesFromAuthContext(ctx, 'oauth-google-callback');
    await this.markOAuthOnboardingRequiredForNewUser(ctx, 'oauth-google-callback', 'google');
  }

  @AfterHook('/callback/github')
  async onGithubCallback(ctx: AuthHookContext): Promise<void> {
    await this.tryHydrateUserNamesFromAuthContext(ctx, 'oauth-github-callback');
    await this.markOAuthOnboardingRequiredForNewUser(ctx, 'oauth-github-callback', 'github');
  }

  private async markOAuthOnboardingRequiredForNewUser(
    ctx: AuthHookContext,
    source: string,
    providerId: string
  ): Promise<void> {
    const userId = this.extractUserId(ctx);
    if (!userId) return;

    try {
      const user = await this.prisma.client.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          createdAt: true,
          hashedPassword: true,
          accounts: {
            where: { providerId },
            select: {
              id: true,
              oauthOnboardingRequired: true,
              oauthOnboardingCompletedAt: true,
            },
            take: 1,
          },
        },
      });
      if (!user) return;
      const oauthAccount = user.accounts[0] ?? null;
      if (!oauthAccount) return;
      if (oauthAccount.oauthOnboardingCompletedAt) return;
      if (oauthAccount.oauthOnboardingRequired) return;
      if (user.hashedPassword) return;

      const createdRecentlyMs = Date.now() - user.createdAt.getTime();
      const maxNewUserWindowMs = 20 * 60 * 1000;
      if (createdRecentlyMs > maxNewUserWindowMs) return;

      await this.prisma.client.account.update({
        where: { id: oauthAccount.id },
        data: { oauthOnboardingRequired: true },
        select: { id: true },
      });
    } catch (err) {
      this.logger.warn(`oauth_onboarding_mark_failed source=${source} userId=${userId}`);
      this.logger.debug(err as object);
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

  private async tryHydrateUserNamesFromAuthContext(
    ctx: AuthHookContext,
    source: string
  ): Promise<void> {
    const userId = this.extractUserId(ctx);
    if (!userId) return;

    try {
      const existing = await this.prisma.client.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
        },
      });
      if (!existing) return;
      if (existing.firstName && existing.lastName) return;

      const inferred = this.extractNamesFromAuthContext(ctx, existing.username);
      if (!inferred.firstName && !inferred.lastName) return;

      await this.prisma.client.user.update({
        where: { id: userId },
        data: {
          firstName: existing.firstName ?? inferred.firstName ?? undefined,
          lastName: existing.lastName ?? inferred.lastName ?? undefined,
        },
        select: { id: true },
      });
    } catch (err) {
      this.logger.warn(`name_hydration_failed source=${source} userId=${userId}`);
      this.logger.debug(err as object);
    }
  }

  private extractNamesFromAuthContext(
    ctx: AuthHookContext,
    username: string | null
  ): { firstName: string | null; lastName: string | null } {
    const root = this.asRecord(ctx);
    const returned = this.asRecord(root?.returned);
    const returnedUser = this.asRecord(returned?.user);

    const firstNameCandidates = [
      returnedUser?.firstName,
      returnedUser?.given_name,
      returnedUser?.givenName,
      returned?.firstName,
      returned?.given_name,
      returned?.givenName,
    ];
    const lastNameCandidates = [
      returnedUser?.lastName,
      returnedUser?.family_name,
      returnedUser?.familyName,
      returned?.lastName,
      returned?.family_name,
      returned?.familyName,
    ];

    const firstName = this.pickNonEmptyString(...firstNameCandidates);
    const lastName = this.pickNonEmptyString(...lastNameCandidates);
    if (firstName || lastName) return { firstName, lastName };

    const fullName = this.pickNonEmptyString(
      returnedUser?.name,
      returned?.name,
      username
    );
    if (!fullName) return { firstName: null, lastName: null };

    const parts = fullName
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (parts.length === 0) return { firstName: null, lastName: null };
    if (parts.length === 1) return { firstName: parts[0]!, lastName: null };
    return {
      firstName: parts[0]!,
      lastName: parts.slice(1).join(' '),
    };
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

  private pickNonEmptyString(...values: unknown[]): string | null {
    for (const value of values) {
      const normalized = this.toNonEmptyString(value);
      if (normalized) return normalized;
    }
    return null;
  }
}
