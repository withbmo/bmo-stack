# Billing Code Cleanup Plan

**Status:** Cleanup Required
**Last Updated:** 2026-02-20

---

## 🧹 Code Duplication Analysis

### Duplicated Methods Between BillingService & BillingFacadeService

| Method | Old (BillingService) | New (BillingFacadeService) | Action |
|--------|---------------------|----------------------------|--------|
| `createCheckoutSession()` | ✅ Lines 108-155 | ✅ `createCheckout()` | ⚠️ **DEPRECATE OLD** |
| `createPortalSession()` | ✅ Lines 157-173 | ✅ `createPortalSession()` | ⚠️ **DEPRECATE OLD** |
| `getSubscription()` | ✅ Lines 175-205 | ✅ `getSubscription()` | ⚠️ **DEPRECATE OLD** |
| `getUserInvoices()` | ✅ Lines 207-227 | ✅ `getInvoices()` | ⚠️ **DEPRECATE OLD** |
| `recordUsage()` | ✅ Lines 311-329 | ✅ `recordUsage()` | ⚠️ **DEPRECATE OLD** |
| `createStripeCustomer()` | ✅ Lines 74-106 (private) | ✅ Private in facade | ⚠️ **Keep private in both** |

**Total Duplicated Code:** ~150 lines

---

## ✅ Methods to Keep in BillingService (For Now)

| Method | Why Keep | Future Plan |
|--------|----------|-------------|
| `getActivePlans()` | Returns public plan list | Move to facade eventually |
| `getUserPaymentMethods()` | Returns Stripe payment methods | Move to facade eventually |
| `validatePaymentMethod()` | Validates payment method ownership | Move to facade eventually |

**Total Unique Code:** ~80 lines

---

## 🗑️ Files/Code to Remove

### Immediate Removal Candidates

1. **None yet** - Need to update controllers first before removing deprecated methods

### After Controller Migration

1. **`BillingService` deprecated methods** (~150 lines)
2. **Potentially entire `BillingService`** if all methods moved to facade

---

## 🔧 Cleanup Actions

### Action 1: Mark Deprecated Methods in BillingService

Add `@deprecated` decorators to duplicated methods:

```typescript
// billing.service.ts

/**
 * @deprecated Use BillingFacadeService.createCheckout() instead
 * This method will be removed in the next major version
 */
async createCheckoutSession(
  userId: string,
  planId: string,
  interval: BillingInterval = 'month'
): Promise<{ sessionId: string; url: string }> {
  // ... existing code
}

/**
 * @deprecated Use BillingFacadeService.createPortalSession() instead
 * This method will be removed in the next major version
 */
async createPortalSession(userId: string): Promise<{ url: string }> {
  // ... existing code
}

/**
 * @deprecated Use BillingFacadeService.getSubscription() instead
 * This method will be removed in the next major version
 */
async getSubscription(userId: string): Promise<SubscriptionWithPlan | null> {
  // ... existing code
}

/**
 * @deprecated Use BillingFacadeService.getInvoices() instead
 * This method will be removed in the next major version
 */
async getUserInvoices(userId: string, limit = 10, offset = 0): Promise<InvoiceListResult> {
  // ... existing code
}

/**
 * @deprecated Use BillingFacadeService.recordUsage() instead
 * This method will be removed in the next major version
 */
async recordUsage(
  userId: string,
  data: { metricName: string; value: number }
): Promise<{ recorded: boolean }> {
  // ... existing code
}
```

**Impact:** TypeScript will show deprecation warnings in IDEs

---

### Action 2: Move Remaining Methods to BillingFacadeService

Add these methods to `BillingFacadeService`:

```typescript
// billing-facade.service.ts

/**
 * Get all active plans (public API)
 */
async getActivePlans(): Promise<PublicPlan[]> {
  return getPlans()
    .sort((a, b) => a.monthlyPrice - b.monthlyPrice)
    .map(plan => this.toPublicPlan(plan))
    .filter((plan): plan is NonNullable<typeof plan> => plan !== null);
}

/**
 * Get user's saved payment methods from Stripe
 */
async getPaymentMethods(userId: string): Promise<PaymentMethodResponse[]> {
  const user = await this.prisma.client.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  });

  if (!user?.stripeCustomerId) {
    return [];
  }

  const stripe = this.stripe.getClient();
  const [customer, methods] = await Promise.all([
    stripe.customers.retrieve(user.stripeCustomerId),
    stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: 'card',
    }),
  ]);

  const defaultPaymentMethod = (customer as Stripe.Customer).invoice_settings?.default_payment_method;
  const defaultPaymentMethodId =
    typeof defaultPaymentMethod === 'string'
      ? defaultPaymentMethod
      : (defaultPaymentMethod?.id ?? null);

  return methods.data.map(pm => {
    const card = pm.card;
    return {
      id: pm.id,
      stripePaymentMethodId: pm.id,
      type: pm.type,
      last4: card?.last4 ?? '',
      brand: card?.brand ?? null,
      expiryMonth: card?.exp_month ?? null,
      expiryYear: card?.exp_year ?? null,
      isDefault: defaultPaymentMethodId ? pm.id === defaultPaymentMethodId : false,
    };
  });
}

/**
 * Validate that a payment method belongs to the user
 */
async validatePaymentMethod(
  userId: string,
  paymentMethodId: string
): Promise<ValidatePaymentMethodResult> {
  const genericError = { valid: false as const, error: 'Invalid payment method' };

  try {
    const [user, paymentMethod] = await Promise.all([
      this.prisma.client.user.findUnique({
        where: { id: userId },
        select: { stripeCustomerId: true },
      }),
      this.stripe
        .getClient()
        .paymentMethods.retrieve(paymentMethodId)
        .catch(() => null),
    ]);

    const stripeCustomerId = user?.stripeCustomerId ?? null;
    const pmCustomer =
      paymentMethod != null
        ? typeof paymentMethod.customer === 'string'
          ? paymentMethod.customer
          : (paymentMethod.customer?.id ?? null)
        : null;

    const isValid =
      stripeCustomerId != null && pmCustomer != null && pmCustomer === stripeCustomerId;

    return isValid ? { valid: true } : genericError;
  } catch {
    return genericError;
  }
}

// Add helper methods
private toApiPlan(plan: ConfigPlan | null): ApiPlan | null {
  if (!plan) return null;
  return {
    id: plan.id,
    name: plan.name,
    displayName: plan.displayName,
    description: plan.description ?? null,
    monthlyPrice: plan.monthlyPrice,
    yearlyPrice: plan.yearlyPrice,
    monthlyCredits: getPlanCredits(plan.id, 'month'),
    yearlyCredits: getPlanCredits(plan.id, 'year'),
    stripePriceIdMonthly: plan.stripePriceIdMonthly ?? null,
    stripePriceIdYearly: plan.stripePriceIdYearly ?? null,
    features: plan.features ?? [],
    isActive: Boolean(plan.isActive),
  };
}

private toPublicPlan(plan: ConfigPlan | null): PublicPlan | null {
  const apiPlan = this.toApiPlan(plan);
  if (!apiPlan) return null;
  const {
    stripePriceIdMonthly: _stripePriceIdMonthly,
    stripePriceIdYearly: _stripePriceIdYearly,
    ...rest
  } = apiPlan;
  return rest;
}
```

---

### Action 3: Update BillingController

Replace `BillingService` with `BillingFacadeService`:

**Before:**
```typescript
constructor(
  private readonly billingService: BillingService,
  private readonly lagoService: LagoService,
  // ...
) {}

@Post('checkout')
async checkout() {
  return this.billingService.createCheckoutSession(...);
}
```

**After:**
```typescript
constructor(
  private readonly billingFacade: BillingFacadeService,
) {}

@Post('checkout')
async checkout() {
  return this.billingFacade.createCheckout(...);
}
```

**Impact:** ~50% less code in controller

---

### Action 4: Remove BillingService

Once all controllers are migrated:

1. Remove `BillingService` from `billing.module.ts` providers
2. Delete `apps/api/src/billing/billing.service.ts`
3. Update imports in any remaining files

**Code Reduction:** ~330 lines removed

---

## 📦 Other Cleanup Items

### 1. Unused Imports

Check for unused imports in:
- ✅ `billing-facade.service.ts` - **Clean**
- ✅ `lago.service.ts` - **Clean** (new methods used)
- ✅ `lago.types.ts` - **Clean** (all types used)

### 2. Dead Code in Lago Types

No dead code found - all new types are actively used.

### 3. Migration Script

The migration script is a standalone tool, not imported anywhere. This is correct - keep it.

---

## 🎯 Execution Order

**Phase 1: Mark Deprecated (Immediate)**
1. Add `@deprecated` JSDoc to old methods in `BillingService`
2. Commit with message: "chore: mark BillingService methods as deprecated"

**Phase 2: Extend Facade (1 hour)**
1. Add remaining methods to `BillingFacadeService`
2. Add helper methods (toApiPlan, toPublicPlan)
3. Test that all methods work
4. Commit with message: "feat: complete BillingFacadeService with all billing operations"

**Phase 3: Update Controllers (2 hours)**
1. Update `BillingController` to use `BillingFacadeService`
2. Update `EntitlementsController` if needed
3. Test all endpoints
4. Commit with message: "refactor: migrate controllers to BillingFacadeService"

**Phase 4: Remove Old Code (30 mins)**
1. Delete `billing.service.ts`
2. Remove from module exports
3. Update any remaining imports
4. Run tests to verify nothing breaks
5. Commit with message: "chore: remove deprecated BillingService"

**Total Time:** ~4 hours
**Code Reduction:** ~330 lines

---

## ✅ Verification Checklist

After cleanup:

- [ ] No `@deprecated` methods remain
- [ ] No unused imports in any billing files
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] BillingController only injects `BillingFacadeService`
- [ ] No references to old `BillingService`
- [ ] Code coverage maintained or improved

---

## 📊 Impact Summary

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Total LOC (billing/) | ~1500 | ~1170 | **-22%** |
| Services injected in controllers | 3-4 | 1 | **-75%** |
| Duplicated code | ~150 lines | 0 | **-100%** |
| BillingService LOC | ~330 | 0 | **-100%** |

---

## 🚀 Next Actions

**Immediate (recommended):**
```bash
# Mark deprecated methods
# Then proceed with Phase 2-4 cleanup
```

**Alternative (conservative):**
```bash
# Just mark deprecated for now
# Remove in next major version
```

Choose based on your timeline and risk tolerance.
