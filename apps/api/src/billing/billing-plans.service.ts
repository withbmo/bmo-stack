import { Injectable } from '@nestjs/common';
import { getPlans } from '@pytholit/config';
import type { Plan } from '@pytholit/contracts';

@Injectable()
export class BillingPlansService {
  getPlans(): Plan[] {
    const plans = getPlans();
    return plans.map(p => ({
      id: p.id,
      name: p.name,
      displayName: p.displayName,
      description: p.description,
      currency: 'USD',
      monthlyPriceCents: Math.round(p.billing.monthly.price * 100),
      yearlyPriceCents: Math.round(p.billing.yearly.price * 100),
      monthlyIncludedCredits: p.billing.monthly.includedCredits,
      yearlyIncludedCredits: p.billing.yearly.includedCredits,
      yearlyBonusCredits: p.billing.yearly.bonusCredits,
      features: p.features.map(f => ({
        id: f.id,
        name: f.name,
        description: f.description,
        type: f.type,
        value: f.value,
      })),
      isActive: p.isActive,
      isDefault: p.isDefault,
    }));
  }
}
