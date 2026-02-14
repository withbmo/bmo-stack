import { BillingService } from './billing.service';

describe('BillingService webhooks', () => {
  it('persists invoice without schema drift', async () => {
    const prismaMock = {
      client: {
        user: {
          findFirst: jest.fn().mockResolvedValue({ id: 'user_1' }),
        },
        invoice: {
          upsert: jest.fn().mockResolvedValue({}),
        },
      },
    } as any;

    const stripeServiceMock = {
      getSubscription: jest.fn(),
      getClient: jest.fn().mockReturnValue({
        paymentMethods: { retrieve: jest.fn() },
      }),
    } as any;

    const configServiceMock = { get: jest.fn() } as any;

    const entitlementsServiceMock = { recordUsage: jest.fn() } as any;

    const service = new BillingService(
      prismaMock,
      stripeServiceMock,
      configServiceMock,
      entitlementsServiceMock
    );

    await service.handleWebhookEvent({
      type: 'invoice.payment_succeeded',
      data: {
        object: {
          id: 'in_1',
          customer: 'cus_1',
          amount_paid: 2500,
          currency: 'usd',
          status: 'paid',
          hosted_invoice_url: 'https://example.test/invoice',
          invoice_pdf: 'https://example.test/invoice.pdf',
          status_transitions: { paid_at: 1710000000 },
          due_date: null,
        },
      },
    } as any);

    expect(prismaMock.client.invoice.upsert).toHaveBeenCalledTimes(1);
    const args = prismaMock.client.invoice.upsert.mock.calls[0][0];
    expect(args.where).toEqual({ stripeInvoiceId: 'in_1' });
    expect(args.create.pdfUrl).toBe('https://example.test/invoice.pdf');
  });

  it('does not write stripeCustomerId to Subscription', async () => {
    const prismaMock = {
      client: {
        user: {
          updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        },
        subscription: {
          upsert: jest.fn().mockResolvedValue({}),
        },
      },
    } as any;

    const stripeServiceMock = {
      getSubscription: jest.fn().mockResolvedValue(null),
      getClient: jest.fn().mockReturnValue({
        paymentMethods: { retrieve: jest.fn() },
      }),
    } as any;

    const configServiceMock = { get: jest.fn() } as any;

    const entitlementsServiceMock = { recordUsage: jest.fn() } as any;

    const service = new BillingService(
      prismaMock,
      stripeServiceMock,
      configServiceMock,
      entitlementsServiceMock
    );

    await service.handleWebhookEvent({
      type: 'checkout.session.completed',
      data: {
        object: {
          metadata: { userId: 'user_1', planId: 'pro' },
          subscription: 'sub_1',
          customer: 'cus_1',
        },
      },
    } as any);

    expect(prismaMock.client.subscription.upsert).toHaveBeenCalledTimes(1);
    const args = prismaMock.client.subscription.upsert.mock.calls[0][0];
    expect(args.create).not.toHaveProperty('stripeCustomerId');
  });
});
