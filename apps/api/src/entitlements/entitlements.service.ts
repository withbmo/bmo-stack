import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { getDefaultPlan, getPlanById } from '@pytholit/config';
type ConfigPlan = ReturnType<typeof getDefaultPlan>;
type ConfigPlanFeature = ConfigPlan['features'][number];

export type EntitlementFeatureUsage = {
  id: string;
  name: string;
  value: ConfigPlanFeature['value'];
  used: number;
  remaining: number | 'unlimited';
};

export type EntitlementLimitsResponse = {
  planId: string;
  periodStart: string;
  periodEnd: string;
  features: EntitlementFeatureUsage[];
};

@Injectable()
export class EntitlementsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  private isEnabled(): boolean {
    return Boolean(this.configService.get<boolean>('ENTITLEMENTS_ENABLED'));
  }

  private ensureEnabled() {
    if (!this.isEnabled()) {
      throw new ServiceUnavailableException('Entitlements are disabled');
    }
  }

  private async resolvePlan(
    userId: string
  ): Promise<{ plan: ConfigPlan; period: { start: Date; end: Date } }> {
    const subscription = await this.prisma.client.subscription.findFirst({
      where: {
        userId,
        status: { in: ['active', 'trialing', 'past_due'] },
      },
      orderBy: { createdAt: 'desc' },
    });

    const plan = subscription?.planId
      ? getPlanById(subscription.planId) ?? getDefaultPlan()
      : getDefaultPlan();

    if (subscription?.currentPeriodStart && subscription?.currentPeriodEnd) {
      return {
        plan,
        period: {
          start: new Date(subscription.currentPeriodStart),
          end: new Date(subscription.currentPeriodEnd),
        },
      };
    }

    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));

    return { plan, period: { start, end } };
  }

  private getFeature(plan: ConfigPlan, featureId: string): ConfigPlanFeature {
    const feature = plan.features.find(
      (f: ConfigPlanFeature) => f.id === featureId
    );
    if (!feature) {
      throw new BadRequestException(`Unknown feature: ${featureId}`);
    }
    return feature;
  }

  private async getUsage(
    userId: string,
    featureId: string,
    periodStart: Date,
    periodEnd: Date
  ) {
    return this.prisma.client.usageCounter.findUnique({
      where: {
        userId_featureId_periodStart_periodEnd: {
          userId,
          featureId,
          periodStart,
          periodEnd,
        },
      },
    });
  }

  async getLimits(userId: string): Promise<EntitlementLimitsResponse> {
    this.ensureEnabled();

    const { plan, period } = await this.resolvePlan(userId);

    const features = await Promise.all(
      plan.features.map(async (feature: ConfigPlanFeature) => {
        const usage = await this.getUsage(
          userId,
          feature.id,
          period.start,
          period.end
        );
        const used = usage?.used ?? 0;

        if (feature.value === 'unlimited') {
          return {
            id: feature.id,
            name: feature.name,
            value: feature.value,
            used,
            remaining: 'unlimited' as const,
          };
        }

        if (typeof feature.value !== 'number') {
          return {
            id: feature.id,
            name: feature.name,
            value: feature.value,
            used,
            remaining: 0,
          };
        }

        return {
          id: feature.id,
          name: feature.name,
          value: feature.value,
          used,
          remaining: Math.max(0, feature.value - used),
        };
      })
    );

    return {
      planId: plan.id,
      periodStart: period.start.toISOString(),
      periodEnd: period.end.toISOString(),
      features,
    };
  }

  async canConsume(userId: string, featureId: string, amount: number): Promise<boolean> {
    this.ensureEnabled();

    if (amount <= 0) return false;
    const { plan, period } = await this.resolvePlan(userId);
    const feature = this.getFeature(plan, featureId);

    if (feature.value === 'unlimited') return true;
    if (typeof feature.value !== 'number') return false;

    const usage = await this.getUsage(userId, featureId, period.start, period.end);
    const used = usage?.used ?? 0;
    return used + amount <= feature.value;
  }

  async recordUsage(userId: string, featureId: string, amount: number) {
    this.ensureEnabled();

    if (amount <= 0) {
      throw new BadRequestException('Usage amount must be positive');
    }

    const { plan, period } = await this.resolvePlan(userId);
    const feature = this.getFeature(plan, featureId);

    if (feature.value === 'unlimited') {
      return { recorded: true, ignored: true };
    }

    if (typeof feature.value !== 'number') {
      throw new BadRequestException('Feature is not metered');
    }

    const usage = await this.prisma.client.usageCounter.upsert({
      where: {
        userId_featureId_periodStart_periodEnd: {
          userId,
          featureId,
          periodStart: period.start,
          periodEnd: period.end,
        },
      },
      create: {
        userId,
        featureId,
        periodStart: period.start,
        periodEnd: period.end,
        used: amount,
      },
      update: {
        used: { increment: amount },
      },
    });

    return {
      recorded: true,
      used: usage.used,
      remaining: Math.max(0, feature.value - usage.used),
    };
  }
}
