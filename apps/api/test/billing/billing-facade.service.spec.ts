import { BadRequestException } from '@nestjs/common';

import { BillingFacadeService } from '../../src/billing/billing-facade.service';

describe('BillingFacadeService checkout flow', () => {
  function createService() {
    const lago = {
      getPlan: jest.fn(),
      createCustomer: jest.fn(),
      getSubscription: jest.fn(),
      terminateSubscription: jest.fn(),
      createSubscription: jest.fn(),
      regenerateCustomerCheckoutUrl: jest.fn(),
      hasCustomerPaymentProvider: jest.fn(),
      getWallet: jest.fn(),
      getWalletBalance: jest.fn(),
      topUpWallet: jest.fn(),
      createWallet: jest.fn(),
      getCustomerPortalUrl: jest.fn(),
    } as any;

    const prisma = {
      client: {
        $transaction: jest.fn(async (actions: Array<Promise<unknown>>) => Promise.all(actions)),
        subscription: {
          upsert: jest.fn(),
        },
        creditLedgerEntry: {
          create: jest.fn(),
        },
        creditTopupRequest: {
          upsert: jest.fn(),
          findUnique: jest.fn(),
          updateMany: jest.fn(),
          update: jest.fn(),
        },
      },
    } as any;

    const billingConfig = {
      frontendUrl: 'http://localhost:3000',
      lagoEnabled: true,
      shouldUseLago: jest.fn().mockReturnValue(true),
    } as any;

    const service = new BillingFacadeService(lago, prisma, billingConfig);
    return { service, lago, prisma };
  }

  it('returns Lago setup URL and does not create subscription before finalize', async () => {
    const { service, lago, prisma } = createService();
    lago.getPlan.mockResolvedValue({ code: 'pro_monthly' });
    lago.getSubscription.mockResolvedValue(null);
    lago.regenerateCustomerCheckoutUrl.mockResolvedValue('https://lago/checkout');

    const result = await service.createCheckout('user_1', 'pro_monthly');

    expect(result).toEqual({
      status: 'requires_payment_method',
      requiresPaymentMethod: true,
      paymentSetupUrl: 'https://lago/checkout',
      pendingPlanCode: 'pro_monthly',
    });
    expect(lago.createSubscription).not.toHaveBeenCalled();
    expect(prisma.client.subscription.upsert).not.toHaveBeenCalled();
  });

  it('rejects finalize when customer has no linked payment provider', async () => {
    const { service, lago } = createService();
    lago.getPlan.mockResolvedValue({ code: 'pro_monthly' });
    lago.hasCustomerPaymentProvider.mockResolvedValue(false);

    await expect(service.finalizeCheckout('user_1', 'pro_monthly')).rejects.toBeInstanceOf(
      BadRequestException
    );
    expect(lago.createSubscription).not.toHaveBeenCalled();
  });

  it('finalize is idempotent when same plan is already active', async () => {
    const { service, lago, prisma } = createService();
    lago.getPlan.mockResolvedValue({ code: 'pro_monthly' });
    lago.hasCustomerPaymentProvider.mockResolvedValue(true);
    lago.getSubscription.mockResolvedValue({
      lago_id: 'sub_1',
      external_customer_id: 'user_1',
      plan_code: 'pro_monthly',
      status: 'active',
      current_period_start: '2026-02-01T00:00:00.000Z',
      current_period_end: '2026-03-01T00:00:00.000Z',
    });
    prisma.client.subscription.upsert.mockResolvedValue({});

    const result = await service.finalizeCheckout('user_1', 'pro_monthly');

    expect(result.requiresPaymentMethod).toBe(false);
    expect(result.status).toBe('activated');
    expect(result.subscription).toEqual({
      id: 'sub_1',
      planCode: 'pro_monthly',
      status: 'active',
    });
    expect(lago.terminateSubscription).not.toHaveBeenCalled();
    expect(lago.createSubscription).not.toHaveBeenCalled();
  });

  it('completes two-phase flow and creates subscription during finalize', async () => {
    const { service, lago, prisma } = createService();
    lago.getPlan.mockResolvedValue({ code: 'pro_monthly' });
    lago.getSubscription.mockResolvedValueOnce(null);
    lago.regenerateCustomerCheckoutUrl.mockResolvedValue('https://lago/checkout');

    const init = await service.createCheckout('user_1', 'pro_monthly');
    expect(init.requiresPaymentMethod).toBe(true);

    lago.hasCustomerPaymentProvider.mockResolvedValue(true);
    lago.getSubscription.mockResolvedValueOnce(null);
    lago.createSubscription.mockResolvedValue({
      lago_id: 'sub_2',
      external_customer_id: 'user_1',
      plan_code: 'pro_monthly',
      status: 'active',
      current_period_start: '2026-02-01T00:00:00.000Z',
      current_period_end: '2026-03-01T00:00:00.000Z',
    });
    prisma.client.subscription.upsert.mockResolvedValue({});

    const finalized = await service.finalizeCheckout('user_1', 'pro_monthly');
    expect(finalized).toMatchObject({
      requiresPaymentMethod: false,
      subscription: { id: 'sub_2', planCode: 'pro_monthly', status: 'active' },
    });
    expect(lago.createSubscription).toHaveBeenCalledWith('user_1', 'pro_monthly');
  });

  it('processes paid top-up invoice exactly once', async () => {
    const { service, lago, prisma } = createService();
    prisma.client.creditTopupRequest.findUnique.mockResolvedValueOnce({
      id: 'topup_1',
      userId: 'user_1',
      credits: 200,
      status: 'pending',
    });
    prisma.client.creditTopupRequest.updateMany.mockResolvedValue({ count: 1 });
    lago.getWallet.mockResolvedValue({ lago_id: 'wallet_1' });
    lago.getWalletBalance.mockResolvedValue(200);

    const result = await service.processPaidInvoiceTopup('inv_1');
    expect(result).toBe('processed');
    expect(lago.topUpWallet).toHaveBeenCalledWith('wallet_1', 200);
    expect(prisma.client.creditTopupRequest.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: 'succeeded' }) })
    );
    expect(prisma.client.creditLedgerEntry.create).toHaveBeenCalled();

    prisma.client.creditTopupRequest.findUnique.mockResolvedValueOnce({
      id: 'topup_1',
      userId: 'user_1',
      credits: 200,
      status: 'succeeded',
    });
    const skipped = await service.processPaidInvoiceTopup('inv_1');
    expect(skipped).toBe('skipped');
  });

  it('returns only plans that exist in Lago for both monthly and yearly intervals', async () => {
    const { service, lago } = createService();
    lago.listPlans = jest.fn().mockResolvedValue([
      { code: 'free_monthly', amount_cents: 0 },
      { code: 'free_yearly', amount_cents: 0 },
      { code: 'pro_monthly', amount_cents: 2900 },
      { code: 'pro_yearly', amount_cents: 29000 },
      // Missing enterprise_yearly on purpose to ensure filtering.
      { code: 'enterprise_monthly', amount_cents: 19900 },
    ]);

    const plans = await service.getActivePlans();
    expect(plans.some((p) => p.id === 'enterprise')).toBe(false);
    expect(plans.some((p) => p.id === 'pro')).toBe(true);
  });

  it('skips top-up processing when invoice row is already claimed by another worker', async () => {
    const { service, prisma } = createService();
    prisma.client.creditTopupRequest.findUnique.mockResolvedValueOnce({
      id: 'topup_1',
      userId: 'user_1',
      credits: 200,
      status: 'pending',
    });
    prisma.client.creditTopupRequest.updateMany.mockResolvedValue({ count: 0 });

    const result = await service.processPaidInvoiceTopup('inv_1');
    expect(result).toBe('skipped');
  });

  it('previews a plan change with proration details', async () => {
    const { service, lago } = createService();
    const now = Date.now();
    lago.getSubscription.mockResolvedValue({
      lago_id: 'sub_1',
      external_customer_id: 'user_1',
      plan_code: 'pro_monthly',
      status: 'active',
      current_period_start: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString(),
      current_period_end: new Date(now + 10 * 24 * 60 * 60 * 1000).toISOString(),
    });

    const preview = await service.previewPlanChange('user_1', 'enterprise', 'year');
    expect(preview.currency).toBe('USD');
    expect(preview.oldPlan.planId).toBe('pro');
    expect(preview.newPlan.planId).toBe('enterprise');
    expect(preview.remainingRatio).toBeGreaterThan(0.4);
    expect(preview.remainingRatio).toBeLessThan(0.6);
  });

  it('applies plan change and records proration credit ledger event', async () => {
    const { service, lago, prisma } = createService();
    const now = Date.now();
    const oldSub = {
      lago_id: 'sub_1',
      external_customer_id: 'user_1',
      plan_code: 'pro_monthly',
      status: 'active',
      current_period_start: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString(),
      current_period_end: new Date(now + 10 * 24 * 60 * 60 * 1000).toISOString(),
    };
    const newSub = {
      lago_id: 'sub_2',
      external_customer_id: 'user_1',
      plan_code: 'enterprise_yearly',
      status: 'active',
      current_period_start: new Date(now).toISOString(),
      current_period_end: new Date(now + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };

    lago.getSubscription
      .mockResolvedValueOnce(oldSub) // apply->preview validation
      .mockResolvedValueOnce(oldSub) // finalize existing subscription
      .mockResolvedValueOnce(newSub) // snapshot fetch
      .mockResolvedValue(newSub);
    lago.getPlan.mockResolvedValue({ code: 'enterprise_yearly' });
    lago.hasCustomerPaymentProvider.mockResolvedValue(true);
    lago.createSubscription.mockResolvedValue(newSub);
    lago.getWalletBalance.mockResolvedValue(1200);
    prisma.client.subscription.upsert.mockResolvedValue({});

    const preview = await service.previewPlanChange('user_1', 'enterprise', 'year');
    const result = await service.applyPlanChange('user_1', 'enterprise', 'year', preview.previewId);

    expect(result.status).toBe('activated');
    expect(result.subscriptionSnapshot?.planId).toBe('enterprise');
    expect(prisma.client.creditLedgerEntry.create).toHaveBeenCalled();
  });
});
