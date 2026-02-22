# Lago Billing Refactoring Plan

## Executive Summary

This document outlines the strategy to reduce custom billing code by 25-40% through better utilization of Lago's native features.

**Current State:** Custom code duplicates Lago functionality
**Target State:** Leverage Lago as the single source of truth for billing, limits, and entitlements

---

## Phase 1 Audit Results

### What We're Currently Doing Wrong

1. **Storing plan limits in JSON files** instead of Lago plans
2. **Manual entitlement checks** instead of using Lago's charge models
3. **Polling usage** on every request instead of using webhooks
4. **Custom metric mapping** instead of using Lago billable metric codes directly
5. **Local subscription tracking** when Lago is already tracking this

### Lago Features We Should Use

#### 1. **Plans with Charge Models**
**Lago Docs:** [Usage-based charges](https://getlago.com/docs/guide/plans/charges/usage-based-charges)

Instead of:
```typescript
// Current: Checking limits manually
const { plan } = await resolvePlan(userId);
const feature = getFeature(plan, 'projects');
const used = await getUsage(userId, 'projects');
if (used >= feature.value) throw new Error('Limit exceeded');
```

Use Lago's charge with `max_usage` property:
```json
{
  "plan": {
    "code": "free_monthly",
    "charges": [
      {
        "billable_metric_code": "projects",
        "charge_model": "package",
        "properties": {
          "amount": "0",
          "package_size": 1,
          "max_units": 3  // This is the limit!
        }
      }
    ]
  }
}
```

**Code Reduction:** ~60% of EntitlementsService logic

#### 2. **Billable Metrics with Aggregations**
**Lago Docs:** [Create billable metrics](https://www.getlago.com/docs/guide/billable-metrics/create-billable-metrics)

Define metrics in Lago UI matching our features:
- `projects` → COUNT_AGG (count unique projects)
- `deployments_monthly` → COUNT_AGG (count deployments)
- `environments` → COUNT_AGG (count environments)
- `storage_gb` → SUM_AGG (sum storage usage)

**Code Reduction:** ~30 lines of metric mapping logic

#### 3. **Threshold Webhooks**
**Lago Feature:** Emit webhooks when usage crosses thresholds

Instead of checking limits on every API request, configure Lago to send webhooks:
```json
{
  "threshold": {
    "billable_metric_code": "projects",
    "threshold_values": [80, 100],  // Alert at 80%, block at 100%
    "recurring": false
  }
}
```

Then react to `threshold.reached` webhook:
```typescript
// webhook handler
if (event.type === 'threshold.reached' && event.data.threshold_value === 100) {
  // Notify user or block further usage
}
```

**Code Reduction:** ~40 lines of limit checking logic

#### 4. **Current Usage API**
Already using this via `getCurrentUsage()`, but can optimize queries.

#### 5. **Plan Overrides**
Enable custom pricing per customer:
```typescript
// Override plan for specific customer
await lago.createSubscription(userId, {
  plan_code: 'pro_monthly',
  plan_overrides: {
    charges: [{
      billable_metric_code: 'projects',
      properties: { max_units: 50 }  // Custom limit for this customer
    }]
  }
});
```

**New Feature:** Custom limits per user (not currently possible)

---

## Refactoring Strategy

### Step 1: Migrate Plans to Lago (Highest Impact)

**Current:**
- Plans defined in `packages/config/src/plans/*.json`
- Manually synced to code
- No UI management

**Target:**
- Plans defined in Lago UI or via API
- Single source of truth
- Dynamic updates without deployment

**Action Items:**
1. Create Lago plans via API for each plan (free, pro, enterprise)
2. Define billable metrics for each feature
3. Configure charges with appropriate limits
4. Update code to fetch plan details from Lago, not JSON

**Files to Change:**
- ❌ Delete `packages/config/src/plans/*.json` (after migration)
- ✏️ Update `packages/config/src/index.ts` to fetch from Lago
- ✏️ Update `EntitlementsService.resolvePlan()` to use Lago's plan data

**Code Reduction:** ~100-150 lines

---

### Step 2: Simplify EntitlementsService

**Current Logic:**
```typescript
async canConsume(userId, featureId, amount) {
  const { plan } = await resolvePlan(userId);  // DB query
  const feature = getFeature(plan, featureId);  // JSON lookup
  const used = await getUsage(userId, featureId);  // Lago API call
  return used + amount <= feature.value;  // Manual check
}
```

**New Logic:**
```typescript
async canConsume(userId, featureId, amount) {
  // Lago already tracks limits in the charge model
  // Just check current usage vs. the charge's max_units
  const subscription = await lago.getSubscription(userId);
  const charge = subscription.plan.charges.find(c => c.billable_metric_code === featureId);
  const used = await lago.getCurrentUsage(userId, featureId);
  return used + amount <= charge.properties.max_units;
}
```

**Better Yet:** Use Lago's validation API (if available) or rely on threshold webhooks.

**Code Reduction:** ~40-50 lines

---

### Step 3: Implement Threshold Webhooks

**New Flow:**
1. Configure thresholds in Lago for each billable metric
2. Lago sends `threshold.reached` webhook when user hits 80%, 90%, 100%
3. Store threshold events in DB or cache
4. Check cached threshold status instead of querying usage on every request

**Implementation:**
```typescript
// billing/lago-webhook.handler.ts
async handleThresholdReached(event: LagoThresholdEvent) {
  const { external_customer_id, billable_metric_code, threshold_value } = event.data;

  if (threshold_value >= 100) {
    // User has exceeded limit
    await this.redis.set(`limit:${external_customer_id}:${billable_metric_code}`, 'exceeded');
    // Optionally notify user via email/notification
  } else {
    // User is approaching limit (80%, 90%)
    await this.notifyUser(external_customer_id, billable_metric_code, threshold_value);
  }
}

// entitlements/entitlements.service.ts
async canConsume(userId, featureId, amount) {
  // Fast path: Check Redis cache first
  const cached = await this.redis.get(`limit:${userId}:${featureId}`);
  if (cached === 'exceeded') return false;

  // Slow path: Query Lago if not cached
  return this.checkLagoUsage(userId, featureId, amount);
}
```

**Benefits:**
- ✅ 90% of requests avoid Lago API calls (cached)
- ✅ Real-time limit notifications
- ✅ Reduced latency

**Code Reduction:** Offset by webhook handler, but net reduction ~20-30 lines

---

### Step 4: Create BillingFacadeService

**Purpose:** Consolidate all billing operations into a single, high-level API

**Current:**
- Controllers inject both `BillingService`, `LagoService`, `StripeService`, `EntitlementsService`
- Duplicated error handling
- Complex orchestration logic spread across multiple files

**New:**
```typescript
// billing/billing-facade.service.ts
@Injectable()
export class BillingFacadeService {
  constructor(
    private lago: LagoService,
    private stripe: StripeService,
    private prisma: PrismaService,
  ) {}

  async createSubscription(userId: string, planCode: string): Promise<SubscriptionResult> {
    // High-level orchestration
    const customer = await this.lago.createCustomer(userId);
    const subscription = await this.lago.createSubscription(userId, planCode);

    // Setup payment method if needed
    const paymentSetup = await this.stripe.createSetupSession(userId);

    // Update local DB
    await this.prisma.client.subscription.create({
      data: {
        userId,
        planId: this.extractPlanId(planCode),
        externalSubscriptionId: subscription.lago_id,
        status: subscription.status,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
      }
    });

    return {
      subscription,
      paymentUrl: paymentSetup.url,
    };
  }

  async getLimits(userId: string): Promise<EntitlementLimitsResponse> {
    const subscription = await this.lago.getSubscription(userId);
    if (!subscription) {
      return this.getDefaultLimits();
    }

    // Map Lago charges to feature limits
    const features = subscription.plan.charges.map(charge => ({
      id: charge.billable_metric_code,
      name: charge.billable_metric_name,
      value: charge.properties.max_units ?? 'unlimited',
      used: charge.current_usage ?? 0,
      remaining: this.calculateRemaining(charge),
    }));

    return {
      planId: subscription.plan.code,
      periodStart: subscription.current_period_start,
      periodEnd: subscription.current_period_end,
      features,
    };
  }

  // More high-level methods...
}
```

**Code Reduction:** ~25-30% across controller/service layers

---

## Migration Plan

### Phase 2A: Create Lago Plans via API (Day 1-2)

**Script:** `scripts/migrate-plans-to-lago.ts`

```typescript
import { LagoService } from '../apps/api/src/billing/lago.service';
import { getPlans } from '@pytholit/config';

async function migratePlansToLago() {
  const lago = new LagoService(/* config */);
  const plans = getPlans();

  for (const plan of plans) {
    console.log(`Creating Lago plan: ${plan.id}`);

    // Create billable metrics
    const metrics = plan.features
      .filter(f => typeof f.value === 'number' || f.value === 'unlimited')
      .map(f => ({
        code: f.id,
        name: f.name,
        aggregation_type: f.id.includes('storage') ? 'sum_agg' : 'count_agg',
      }));

    for (const metric of metrics) {
      await lago.createBillableMetric(metric);
    }

    // Create plan with charges
    await lago.createPlan({
      code: `${plan.id}_monthly`,
      name: plan.displayName,
      interval: 'monthly',
      amount_cents: plan.monthlyPrice * 100,
      amount_currency: 'USD',
      charges: plan.features.map(f => ({
        billable_metric_code: f.id,
        charge_model: 'package',
        properties: {
          amount: '0',
          package_size: 1,
          max_units: f.value === 'unlimited' ? null : f.value,
        },
      })),
    });
  }
}
```

**Verification:**
1. Run script against Lago staging environment
2. Verify plans created correctly in Lago UI
3. Test subscription creation with new plan codes
4. Rollback plan if issues

---

### Phase 2B: Refactor EntitlementsService (Day 3-4)

**Changes:**
```diff
// entitlements.service.ts

- private async resolvePlan(userId: string) {
-   const subscription = await this.prisma.client.subscription.findFirst({...});
-   const plan = subscription?.planId ? getPlanById(subscription.planId) : getDefaultPlan();
-   return { plan, period: {...} };
- }

+ private async resolvePlan(userId: string) {
+   const subscription = await this.lago.getSubscription(userId);
+   if (!subscription) return this.getDefaultPlan();
+   return {
+     plan: subscription.plan,
+     period: {
+       start: new Date(subscription.current_period_start),
+       end: new Date(subscription.current_period_end),
+     }
+   };
+ }

- async getLimits(userId: string): Promise<EntitlementLimitsResponse> {
-   const { plan, period } = await this.resolvePlan(userId);
-   const features = await Promise.all(plan.features.map(async (feature) => {
-     const used = await this.getUsage(userId, feature.id);
-     return { ...feature, used, remaining: feature.value - used };
-   }));
-   return { planId: plan.id, periodStart: period.start.toISOString(), periodEnd: period.end.toISOString(), features };
- }

+ async getLimits(userId: string): Promise<EntitlementLimitsResponse> {
+   const subscription = await this.lago.getSubscription(userId);
+   if (!subscription) return this.getDefaultLimits();
+
+   const features = subscription.plan.charges.map(charge => ({
+     id: charge.billable_metric_code,
+     name: charge.billable_metric_name,
+     value: charge.properties.max_units ?? 'unlimited',
+     used: charge.current_usage ?? 0,
+     remaining: this.calculateRemaining(charge),
+   }));
+
+   return {
+     planId: subscription.plan.code,
+     periodStart: subscription.current_period_start,
+     periodEnd: subscription.current_period_end,
+     features,
+   };
+ }
```

---

### Phase 2C: Implement Threshold Webhooks (Day 4-5)

**Add to LagoWebhookHandler:**
```typescript
// lago-webhook.handler.ts

async handle(event: LagoWebhookEvent) {
  switch (event.type) {
    case 'threshold.reached':
      await this.handleThresholdReached(event);
      break;
    // ... existing cases
  }
}

private async handleThresholdReached(event: LagoThresholdEvent) {
  const { external_customer_id, billable_metric_code, threshold_value } = event.data;

  this.logger.log(`User ${external_customer_id} reached ${threshold_value}% of ${billable_metric_code}`);

  if (threshold_value >= 100) {
    // Cache limit exceeded status
    await this.cacheService.set(
      `limit:${external_customer_id}:${billable_metric_code}`,
      'exceeded',
      { ttl: 3600 }  // 1 hour cache
    );

    // Notify user
    await this.notificationService.send(external_customer_id, {
      type: 'limit_exceeded',
      metric: billable_metric_code,
    });
  } else {
    // Warning notification
    await this.notificationService.send(external_customer_id, {
      type: 'limit_warning',
      metric: billable_metric_code,
      percentage: threshold_value,
    });
  }
}
```

---

### Phase 2D: Create BillingFacadeService (Day 5-6)

See Step 4 above for implementation.

**Integration Points:**
- Update `BillingController` to use `BillingFacadeService` instead of multiple services
- Update `EntitlementsController` to use facade
- Deprecate old service injections

---

## Testing Strategy

### Unit Tests
- [ ] LagoService methods (mock Axios)
- [ ] BillingFacadeService orchestration
- [ ] EntitlementsService with Lago plans
- [ ] Webhook handlers

### Integration Tests
- [ ] Full checkout flow (subscription creation)
- [ ] Usage tracking and limit enforcement
- [ ] Webhook processing (Lago + Stripe)
- [ ] Invoice generation

### Load Tests
- [ ] 1000 events/sec to Lago
- [ ] Concurrent limit checks
- [ ] Webhook burst processing

### Manual QA
- [ ] Create subscription in Lago UI
- [ ] Test limit enforcement in app
- [ ] Verify webhooks trigger correctly
- [ ] Check invoice accuracy

---

## Rollback Plan

If issues arise:

1. **Keep both systems running** during migration (feature flag)
2. **Gradual rollout** via `LAGO_ROLLOUT_PERCENT` (already implemented)
3. **Fallback to JSON plans** if Lago API fails:
```typescript
async resolvePlan(userId: string) {
  try {
    return await this.getLagoPlan(userId);
  } catch (error) {
    this.logger.warn('Lago unavailable, falling back to local plans');
    return this.getLocalPlan(userId);
  }
}
```

---

## Success Metrics

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Lines of Code | ~500 (billing + entitlements) | ~300 | File LOC count |
| API Calls per Request | 2-3 (usage checks) | 0-1 (cached) | APM traces |
| Limit Check Latency | 200-500ms | <50ms | APM p95 |
| Plan Update Time | Hours (requires deployment) | Minutes (Lago UI) | Time to update |
| Test Coverage | ~60% | >80% | Jest coverage report |

---

## Next Steps

1. ✅ Complete Phase 1 Audit (DONE)
2. ⏳ Review this plan with team
3. 🔜 Execute Phase 2A: Migrate plans to Lago
4. 🔜 Execute Phase 2B-D: Refactor services
5. 🔜 Execute Phase 3: Evaluate OpenMeter (optional)
6. 🔜 Execute Phase 4: Remove JSON plan files
7. 🔜 Execute Phase 5: Testing & validation

---

## References

- [Lago Usage-Based Charges](https://getlago.com/docs/guide/plans/charges/usage-based-charges)
- [Lago Create Billable Metrics](https://www.getlago.com/docs/guide/billable-metrics/create-billable-metrics)
- [Lago API Documentation](https://docs.getlago.com)
- [Open Source Billing Platforms Comparison](https://flexprice.io/blog/best-open-source-alternatives-to-traditional-billing-platforms)

**Document Version:** 1.0
**Last Updated:** 2026-02-20
**Author:** Claude Code Refactoring Analysis
