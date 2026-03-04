import { BadRequestException } from '@nestjs/common';
import { BillingFacadeService } from '../../src/billing/billing-facade.service';

describe('BillingFacadeService', () => {
  const makeService = (deps?: {
    prisma?: any;
    config?: any;
    plans?: any;
    billingAccess?: any;
    stripeWebhook?: any;
    stripeService?: any;
    stripeCustomers?: any;
    environmentsLifecycle?: any;
  }) => {
    const prisma = deps?.prisma || {
      client: {
        user: {
          findUnique: jest.fn(),
          update: jest.fn(),
        },
        stripePlanPrice: {
          findFirst: jest.fn(),
          findUnique: jest.fn(),
        },
        environment: { findMany: jest.fn().mockResolvedValue([]) },
      },
    };

    const config = deps?.config || {
      get: jest.fn(),
    };

    const plans = deps?.plans || {
      getPublicPlans: jest.fn().mockReturnValue([]),
    };

    const billingAccess = deps?.billingAccess || {
      getStateForUser: jest.fn().mockResolvedValue({
        userId: 'user1',
        provider: 'lago',
        externalCustomerId: 'user1',
        externalSubscriptionId: 'sub_user1',
        planCode: 'pro_month',
        accessState: 'enabled',
        lockedReason: null,
      }),
    };

    const stripeWebhook = deps?.stripeWebhook || {
      receiveWebhook: jest.fn(),
    };

    const stripeService = deps?.stripeService || {
      client: jest.fn(),
    };

    const stripeCustomers = deps?.stripeCustomers || {
      getOrCreateStripeCustomerIdForUser: jest.fn().mockResolvedValue('cus_123'),
    };

    const environmentsLifecycle = deps?.environmentsLifecycle || {
      stopEnvironment: jest.fn(),
    };

    const service = new BillingFacadeService(
      prisma as any,
      config as any,
      plans as any,
      billingAccess as any,
      stripeWebhook as any,
      stripeService as any,
      stripeCustomers as any,
      environmentsLifecycle as any
    );

    return {
      service,
      prisma,
      config,
      plans,
      billingAccess,
      stripeWebhook,
      stripeService,
      stripeCustomers,
      environmentsLifecycle,
    };
  };

  describe('createCheckoutSession()', () => {
    it('throws BadRequestException for free plan', async () => {
      const { service } = makeService();

      await expect(
        service.createCheckoutSession('user1', 'free', 'month')
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException for invalid interval', async () => {
      const { service } = makeService();

      await expect(
        (service.createCheckoutSession as any)('user1', 'pro', 'weekly')
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('createCreditTopupSession()', () => {
    it('creates a Stripe Checkout session in payment mode', async () => {
      const stripe = {
        checkout: {
          sessions: {
            create: jest.fn().mockResolvedValue({ url: 'https://stripe.test/session' }),
          },
        },
      };

      const { service, stripeService } = makeService({
        config: { get: jest.fn((k: string) => (k === 'FRONTEND_URL' ? 'http://localhost:3000' : '')) },
        stripeService: { client: jest.fn().mockReturnValue(stripe) },
      });

      const res = await (service as any).createCreditTopupSession('user1', 10);

      expect(res.url).toBe('https://stripe.test/session');
      expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'payment',
          invoice_creation: expect.objectContaining({ enabled: true }),
        })
      );
    });
  });
});
