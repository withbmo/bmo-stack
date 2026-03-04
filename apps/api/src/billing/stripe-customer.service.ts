import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';
import { StripeService } from '../stripe/stripe.service';
import { BILLING_ERROR_CODE } from './billing-error-codes';

@Injectable()
export class StripeCustomerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService
  ) {}

  async getOrCreateStripeCustomerIdForUser(userId: string): Promise<string> {
    const existing = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true, email: true },
    });

    if (existing?.stripeCustomerId) return existing.stripeCustomerId;

    const email = existing?.email ?? null;
    if (!email) {
      throw new BadRequestException({
        code: BILLING_ERROR_CODE.BILLING_MISSING_EMAIL,
        detail: 'User email is required for Stripe.',
      });
    }

    const stripe = this.stripeService.client();
    const customer = await stripe.customers.create({
      email,
      metadata: { userId },
    });

    await this.prisma.client.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
      select: { id: true },
    });

    return customer.id;
  }
}
