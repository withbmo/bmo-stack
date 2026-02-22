import { EntitlementsService } from '../../src/entitlements/entitlements.service';

describe('EntitlementsService', () => {
  it('records usage via Lago events when enabled for user', async () => {
    const prismaMock = {
      client: {
        subscription: { findFirst: jest.fn().mockResolvedValue(null) },
      },
    } as any;

    const configServiceMock = {
      get: jest.fn((key: string) => {
        if (key === 'ENTITLEMENTS_ENABLED') return true;
        return undefined;
      }),
    } as any;

    const billingConfigMock = {
      shouldUseLago: jest.fn().mockReturnValue(true),
    } as any;

    const lagoServiceMock = {
      sendEvent: jest.fn().mockResolvedValue(undefined),
      getCurrentUsage: jest.fn().mockResolvedValue(1),
    } as any;

    const service = new EntitlementsService(
      prismaMock,
      configServiceMock,
      billingConfigMock,
      lagoServiceMock
    );

    const result = await service.recordUsage('user_1', 'deployments', 1, 'op_1');

    expect(result.recorded).toBe(true);
    expect(lagoServiceMock.sendEvent).toHaveBeenCalledTimes(1);
    expect(lagoServiceMock.getCurrentUsage).toHaveBeenCalledTimes(1);
  });

  it('fails when Lago rollout is disabled for user', async () => {
    const prismaMock = {
      client: {
        subscription: { findFirst: jest.fn().mockResolvedValue(null) },
      },
    } as any;

    const configServiceMock = {
      get: jest.fn((key: string) => {
        if (key === 'ENTITLEMENTS_ENABLED') return true;
        return undefined;
      }),
    } as any;

    const billingConfigMock = {
      shouldUseLago: jest.fn().mockReturnValue(false),
    } as any;

    const lagoServiceMock = {
      sendEvent: jest.fn(),
      getCurrentUsage: jest.fn(),
    } as any;

    const service = new EntitlementsService(
      prismaMock,
      configServiceMock,
      billingConfigMock,
      lagoServiceMock
    );

    await expect(service.recordUsage('user_1', 'deployments', 1, 'op_2')).rejects.toThrow(
      'Lago entitlements are not enabled for this account'
    );
  });
});
