import { Injectable } from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';
import { type BillingAccessState, type BillingPlanCode } from './billing.interface';

export type UpsertBillingStateInput = {
  userId: string;
  planCode: BillingPlanCode;
  planCatalogVersion?: number | null;
  accessState: BillingAccessState;
  lockedReason?: string | null;
  lastStripeEventId?: string | null;
};

@Injectable()
export class BillingStateService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertState(input: UpsertBillingStateInput): Promise<void> {
    const externalCustomerId = input.userId;
    const engineSubscriptionExternalId = `sub_${input.userId}`;

    await this.prisma.client.billingEngineState.upsert({
      where: { userId: input.userId },
      update: {
        provider: 'stripe',
        externalCustomerId,
        engineSubscriptionExternalId,
        planCode: input.planCode,
        planCatalogVersion: input.planCatalogVersion ?? null,
        accessState: input.accessState,
        lockedReason: input.lockedReason ?? null,
        lastStripeEventId: input.lastStripeEventId ?? null,
        lastEngineEventId: null,
      },
      create: {
        userId: input.userId,
        provider: 'stripe',
        externalCustomerId,
        engineSubscriptionExternalId,
        planCode: input.planCode,
        planCatalogVersion: input.planCatalogVersion ?? null,
        accessState: input.accessState,
        lockedReason: input.lockedReason ?? null,
        lastStripeEventId: input.lastStripeEventId ?? null,
        lastEngineEventId: null,
      },
      select: { userId: true },
    });
  }
}
