import { createHmac } from 'crypto';

import { LagoService } from '../../src/billing/lago.service';

describe('LagoService', () => {
  function createService() {
    const billingConfigMock = {
      lagoApiUrl: 'http://localhost:3010',
      lagoApiKey: 'test-key',
      lagoWebhookSecret: 'test-webhook-secret',
      lagoEnabled: true,
      frontendUrl: 'http://localhost:3000',
    } as any;

    const prismaMock = {
      client: {
        user: {
          findUnique: jest.fn().mockResolvedValue({
            id: 'user_1',
            email: 'user@example.com',
            firstName: 'Test',
            lastName: 'User',
          }),
        },
      },
    } as any;

    const service = new LagoService(billingConfigMock, prismaMock);
    return { service, billingConfigMock };
  }

  it('verifies webhook signatures', () => {
    const { service, billingConfigMock } = createService();
    const payload = JSON.stringify({ type: 'invoice.paid', data: { lago_id: 'inv_1' } });
    const signature = createHmac('sha256', billingConfigMock.lagoWebhookSecret)
      .update(payload)
      .digest('hex');

    const parsed = service.verifyWebhook(payload, signature);
    expect(parsed.type).toBe('invoice.paid');
  });

  it('extracts checkout URL from regenerate endpoint', async () => {
    const { service } = createService();
    jest.spyOn(service, 'createCustomer').mockResolvedValue({
      lago_id: 'cust_1',
      external_id: 'user_1',
      external_customer_id: 'user_1',
    });
    jest
      .spyOn(service as any, 'request')
      .mockResolvedValueOnce({ checkout_url: 'https://lago/checkout' });

    await expect(service.regenerateCustomerCheckoutUrl('user_1', 'pro_monthly')).resolves.toBe(
      'https://lago/checkout'
    );
  });

  it('extracts portal URL from customer payload', async () => {
    const { service } = createService();
    jest.spyOn(service, 'createCustomer').mockResolvedValue({
      lago_id: 'cust_1',
      external_id: 'user_1',
      external_customer_id: 'user_1',
    });
    jest.spyOn(service as any, 'request').mockResolvedValueOnce({
      customer: { portal_url: 'https://lago/portal' },
    });

    await expect(service.getCustomerPortalUrl('user_1')).resolves.toBe('https://lago/portal');
  });
});
