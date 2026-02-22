import { Injectable } from '@nestjs/common';
import { type AuthHookContext, BeforeHook, Hook } from '@thallesp/nestjs-better-auth';
import { PrismaService } from '../../database/prisma.service';
import { extractNormalizedEmail } from './auth-hook.utils';

@Hook()
@Injectable()
export class EmailVerificationCooldownHook {
  constructor(private readonly prisma: PrismaService) { }

  @BeforeHook('/send-verification-email')
  async enforceCooldown(ctx: AuthHookContext): Promise<void> {
    const email = extractNormalizedEmail(ctx);
    if (!email) return;

    const activeToken = await this.prisma.client.verification.findFirst({
      where: {
        identifier: email,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        expiresAt: 'desc',
      },
      select: {
        expiresAt: true,
      },
    });

    if (!activeToken) return;

    const remainingSeconds = Math.max(
      1,
      Math.ceil((activeToken.expiresAt.getTime() - Date.now()) / 1000)
    );

    // Use dynamic import specifically in the method since ESM require from CJS is forbidden
    const authApi = await import('better-auth');
    throw new authApi.APIError('TOO_MANY_REQUESTS', {
      code: 'AUTH_VERIFICATION_COOLDOWN',
      detail: `Verification code already sent. Try again in ${remainingSeconds} seconds.`,
    });
  }
}
