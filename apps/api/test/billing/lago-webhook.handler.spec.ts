import { Prisma } from '@pytholit/db';

import { LagoWebhookHandler } from '../../src/billing/lago-webhook.handler';

describe('LagoWebhookHandler', () => {
  it('skips duplicate webhook events', async () => {
    const billingFacadeMock = {
      processPaidInvoiceTopup: jest.fn().mockResolvedValue('processed'),
    } as any;
    const prismaMock = {
      client: {
        lagoWebhookEvent: {
          create: jest
            .fn()
            .mockResolvedValueOnce({})
            .mockRejectedValueOnce(
              new Prisma.PrismaClientKnownRequestError('duplicate', {
                code: 'P2002',
                clientVersion: 'test',
              })
            ),
        },
        subscription: {
          updateMany: jest.fn().mockResolvedValue({ count: 0 }),
        },
      },
    } as any;

    const handler = new LagoWebhookHandler(prismaMock, billingFacadeMock);
    const event = {
      id: 'evt_lago_1',
      type: 'invoice.paid',
      data: { lago_id: 'inv_1', external_customer_id: 'user_1' },
    };

    await handler.handleWebhook(event);
    await handler.handleWebhook(event);

    expect(prismaMock.client.lagoWebhookEvent.create).toHaveBeenCalledTimes(2);
  });

  it('upserts subscription projection from nested payload', async () => {
    const billingFacadeMock = {
      processPaidInvoiceTopup: jest.fn().mockResolvedValue('processed'),
    } as any;
    const prismaMock = {
      client: {
        lagoWebhookEvent: {
          create: jest.fn().mockResolvedValue({}),
        },
        subscription: {
          upsert: jest.fn().mockResolvedValue({}),
          updateMany: jest.fn().mockResolvedValue({ count: 0 }),
        },
      },
    } as any;

    const handler = new LagoWebhookHandler(prismaMock, billingFacadeMock);
    await handler.handleWebhook({
      id: 'evt_lago_sub_1',
      type: 'subscription.updated',
      data: {
        subscription: {
          lago_id: 'sub_1',
          external_customer_id: 'user_1',
          plan_code: 'pro_monthly',
          status: 'active',
          current_period_start: '2026-02-01T00:00:00.000Z',
          current_period_end: '2026-03-01T00:00:00.000Z',
        },
      },
    });

    expect(prismaMock.client.subscription.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { externalSubscriptionId: 'sub_1' },
        create: expect.objectContaining({
          userId: 'user_1',
          planId: 'pro',
          status: 'active',
          billingInterval: 'month',
          featureAccessState: 'enabled',
          cancelAtPeriodEnd: false,
        }),
        update: expect.objectContaining({
          userId: 'user_1',
          planId: 'pro',
          status: 'active',
          billingInterval: 'month',
          featureAccessState: 'enabled',
          cancelAtPeriodEnd: false,
        }),
      })
    );
  });

  it('marks subscription canceled on termination event', async () => {
    const billingFacadeMock = {
      processPaidInvoiceTopup: jest.fn().mockResolvedValue('processed'),
    } as any;
    const prismaMock = {
      client: {
        lagoWebhookEvent: {
          create: jest.fn().mockResolvedValue({}),
        },
        subscription: {
          upsert: jest.fn().mockResolvedValue({}),
          updateMany: jest.fn().mockResolvedValue({ count: 0 }),
        },
      },
    } as any;

    const handler = new LagoWebhookHandler(prismaMock, billingFacadeMock);
    await handler.handleWebhook({
      id: 'evt_lago_sub_2',
      type: 'subscription.cancelled',
      data: {
        lago_id: 'sub_2',
        external_customer_id: 'user_2',
        plan_code: 'enterprise_yearly',
        status: 'terminated',
      },
    });

    expect(prismaMock.client.subscription.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { externalSubscriptionId: 'sub_2' },
        create: expect.objectContaining({
          userId: 'user_2',
          planId: 'enterprise',
          status: 'canceled',
          billingInterval: 'year',
          featureAccessState: 'enabled',
          cancelAtPeriodEnd: true,
        }),
        update: expect.objectContaining({
          userId: 'user_2',
          planId: 'enterprise',
          status: 'canceled',
          billingInterval: 'year',
          featureAccessState: 'enabled',
          cancelAtPeriodEnd: true,
        }),
      })
    );
  });

  it('handles invoice.paid by processing top-up request', async () => {
    const billingFacadeMock = {
      processPaidInvoiceTopup: jest.fn().mockResolvedValue('processed'),
    } as any;
    const prismaMock = {
      client: {
        lagoWebhookEvent: {
          create: jest.fn().mockResolvedValue({}),
        },
        subscription: {
          updateMany: jest.fn().mockResolvedValue({ count: 0 }),
        },
      },
    } as any;

    const handler = new LagoWebhookHandler(prismaMock, billingFacadeMock);
    await handler.handleWebhook({
      id: 'evt_lago_invoice_1',
      type: 'invoice.paid',
      data: {
        invoice: {
          lago_id: 'inv_1',
          external_customer_id: 'user_1',
        },
      },
    });

    expect(billingFacadeMock.processPaidInvoiceTopup).toHaveBeenCalledWith('inv_1');
  });

  it('locks subscription features on invoice payment failure', async () => {
    const billingFacadeMock = {
      processPaidInvoiceTopup: jest.fn().mockResolvedValue('processed'),
    } as any;
    const prismaMock = {
      client: {
        lagoWebhookEvent: {
          create: jest.fn().mockResolvedValue({}),
        },
        creditTopupRequest: {
          findUnique: jest.fn().mockResolvedValue(null),
          update: jest.fn(),
        },
        subscription: {
          updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        },
      },
    } as any;

    const handler = new LagoWebhookHandler(prismaMock, billingFacadeMock);
    await handler.handleWebhook({
      id: 'evt_lago_invoice_fail_1',
      type: 'invoice.payment_failed',
      data: {
        invoice: {
          lago_id: 'inv_fail_1',
          external_customer_id: 'user_9',
        },
      },
    });

    expect(prismaMock.client.subscription.updateMany).toHaveBeenCalledWith({
      where: {
        userId: 'user_9',
        status: { in: ['active', 'trialing', 'past_due'] },
      },
      data: {
        status: 'past_due',
        featureAccessState: 'locked_due_to_payment',
      },
    });
  });
});
