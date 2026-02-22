import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getDefaultPlan, getPlanById } from '@pytholit/config';

import { BillingConfigService } from '../billing/billing.config';
import { LagoService } from '../billing/lago.service';
import { PrismaService } from '../database/prisma.service';

const ACTIVE_SUBSCRIPTION_STATUSES = ['active', 'trialing', 'past_due'] as const;
type ConfigPlan = ReturnType<typeof getDefaultPlan>;
type ConfigPlanFeature = ConfigPlan['features'][number];
const LOCKED_SUBSCRIPTION_STATUSES = new Set(['past_due', 'unpaid']);

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
    private readonly configService: ConfigService,
    private readonly billingConfig: BillingConfigService,
    private readonly lagoService: LagoService
  ) {}

  private isEnabled(): boolean {
    return Boolean(this.configService.get<boolean>('ENTITLEMENTS_ENABLED'));
  }

  private ensureEnabled() {
    if (!this.isEnabled()) {
      throw new ServiceUnavailableException('Entitlements are disabled');
    }
  }

  private ensureLagoEnabled(userId: string) {
    if (!this.billingConfig.shouldUseLago(userId)) {
      throw new ServiceUnavailableException('Lago entitlements are not enabled for this account');
    }
  }

  private async resolvePlan(
    userId: string
  ): Promise<{ plan: ConfigPlan; period: { start: Date; end: Date }; subscriptionStatus: string | null }> {
    const subscription = await this.prisma.client.subscription.findFirst({
      where: {
        userId,
        status: { in: [...ACTIVE_SUBSCRIPTION_STATUSES] },
      },
      orderBy: { createdAt: 'desc' },
    });

    const plan = subscription?.planId
      ? (getPlanById(subscription.planId) ?? getDefaultPlan())
      : getDefaultPlan();

    if (subscription?.currentPeriodStart && subscription?.currentPeriodEnd) {
      return {
        plan,
        period: {
          start: new Date(subscription.currentPeriodStart),
          end: new Date(subscription.currentPeriodEnd),
        },
        subscriptionStatus: subscription.status,
      };
    }

    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));
    return { plan, period: { start, end }, subscriptionStatus: null };
  }

  private getFeature(plan: ConfigPlan, featureId: string): ConfigPlanFeature {
    const feature = plan.features.find((f: ConfigPlanFeature) => f.id === featureId);
    if (!feature) {
      throw new BadRequestException(`Unknown feature: ${featureId}`);
    }
    return feature;
  }

  private mapFeatureToMetric(featureId: string): string {
    const map: Record<string, string> = {
      deployments: 'deployments_monthly',
      projects: 'projects',
      environments: 'environments',
      storage: 'storage_gb',
    };
    return map[featureId] ?? featureId;
  }

  private async getUsage(userId: string, featureId: string): Promise<number> {
    const metricCode = this.mapFeatureToMetric(featureId);
    return this.lagoService.getCurrentUsage(userId, metricCode);
  }

  async getLimits(userId: string): Promise<EntitlementLimitsResponse> {
    this.ensureEnabled();
    this.ensureLagoEnabled(userId);

    const { plan, period } = await this.resolvePlan(userId);

    const features = await Promise.all(
      plan.features.map(async (feature: ConfigPlanFeature) => {
        const used = await this.getUsage(userId, feature.id);

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
    this.ensureLagoEnabled(userId);

    if (amount <= 0) return false;
    const { plan, subscriptionStatus } = await this.resolvePlan(userId);
    if (subscriptionStatus && LOCKED_SUBSCRIPTION_STATUSES.has(subscriptionStatus)) {
      return false;
    }
    const feature = this.getFeature(plan, featureId);

    if (feature.value === 'unlimited') return true;
    if (typeof feature.value !== 'number') return false;

    const used = await this.getUsage(userId, featureId);
    return used + amount <= feature.value;
  }

  async recordUsage(userId: string, featureId: string, amount: number, operationId: string) {
    this.ensureEnabled();
    this.ensureLagoEnabled(userId);

    if (amount <= 0) {
      throw new BadRequestException('Usage amount must be positive');
    }

    const { plan, subscriptionStatus } = await this.resolvePlan(userId);
    if (subscriptionStatus && LOCKED_SUBSCRIPTION_STATUSES.has(subscriptionStatus)) {
      throw new BadRequestException('Subscription features are locked due to billing status');
    }
    const feature = this.getFeature(plan, featureId);

    if (feature.value === 'unlimited') {
      return { recorded: true, ignored: true };
    }

    if (typeof feature.value !== 'number') {
      throw new BadRequestException('Feature is not metered');
    }

    await this.lagoService.sendEvent({
      transaction_id: `${featureId}:${userId}:${operationId}`,
      external_customer_id: userId,
      code: this.mapFeatureToMetric(featureId),
      timestamp: Math.floor(Date.now() / 1000),
      properties: { amount },
    });

    const used = await this.getUsage(userId, featureId);
    return {
      recorded: true,
      used,
      remaining: Math.max(0, feature.value - used),
    };
  }
}
