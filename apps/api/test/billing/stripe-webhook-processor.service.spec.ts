import { StripeWebhookProcessorService } from '../../src/billing/stripe-webhook.processor.service';

describe('StripeWebhookProcessorService', () => {
  const makeService = (deps?: {
    prisma?: any;
    stripeService?: any;
    config?: any;
    engine?: any;
    webhookExplorer?: any;
  }) => {
    const prisma = deps?.prisma || {
      client: {
        billingEngineState: { upsert: jest.fn(), update: jest.fn() },
        stripePlanPrice: { findUnique: jest.fn(), findFirst: jest.fn() },
        user: { findUnique: jest.fn() },
      },
    };

    const stripeService = deps?.stripeService || {
      client: jest.fn(),
    };

    const config = deps?.config || {
      get: jest.fn(),
    };

    const engine = deps?.engine || {
      ensureCustomer: jest.fn(),
      upsertSubscription: jest.fn(),
      terminateSubscription: jest.fn(),
      creditWallet: jest.fn(),
    };

    const webhookExplorer = deps?.webhookExplorer || {
      processWebhookEvent: jest.fn(),
    };

    const service = new StripeWebhookProcessorService(
      prisma as any,
      stripeService as any,
      config as any,
      webhookExplorer as any,
      engine as any
    );

    return { service, prisma, stripeService, config, engine, webhookExplorer };
  };

  it('dispatches a Stripe event to the explorer', async () => {
    const { service, webhookExplorer } = makeService();

    const event = {
      id: 'evt_1',
      type: 'invoice.paid',
      created: 0,
      data: { object: { id: 'in_1' } },
    } as any;

    await service.processStripeEvent(event);
    expect(webhookExplorer.processWebhookEvent).toHaveBeenCalledWith(event);
  });

  it('throws when a handler fails', async () => {
    const { service, webhookExplorer } = makeService();
    webhookExplorer.processWebhookEvent.mockRejectedValue(new Error('Webhook processing error'));

    const event = {
      id: 'evt_1',
      type: 'invoice.paid',
      created: 0,
      data: { object: { id: 'in_1' } },
    } as any;

    await expect(service.processStripeEvent(event)).rejects.toThrow('Webhook processing error');
  });
});
