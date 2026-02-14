import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { OauthStateService } from './oauth-state.service';

type MockRedisClient = {
  on: jest.Mock;
  connect: jest.Mock;
  disconnect: jest.Mock;
  set: jest.Mock;
  getDel: jest.Mock;
};

const mockStore = new Map<string, string>();

const mockClient: MockRedisClient = {
  on: jest.fn(),
  connect: jest.fn().mockResolvedValue(undefined),
  disconnect: jest.fn().mockResolvedValue(undefined),
  set: jest.fn(async (key: string, value: string, opts?: { NX?: boolean }) => {
    if (opts?.NX && mockStore.has(key)) return null;
    mockStore.set(key, value);
    return 'OK';
  }),
  getDel: jest.fn(async (key: string) => {
    const value = mockStore.get(key);
    mockStore.delete(key);
    return value ?? null;
  }),
};

jest.mock('redis', () => ({
  createClient: jest.fn(() => mockClient),
}));

describe('OauthStateService (redis)', () => {
  beforeEach(() => {
    mockStore.clear();
    jest.clearAllMocks();
  });

  it('uses Redis when REDIS_URL is set', async () => {
    const configService = {
      get: jest.fn((key: string) =>
        key === 'REDIS_URL' ? 'redis://localhost:6379' : undefined
      ),
    } as unknown as ConfigService;

    const service = new OauthStateService(configService);
    await service.onModuleInit();

    const state = await service.createState();
    expect(state).toHaveLength(64);

    const ok = await service.consumeState(state);
    expect(ok).toBe(true);

    const second = await service.consumeState(state);
    expect(second).toBe(false);

    await service.onModuleDestroy();

    const createClientMock = createClient as unknown as jest.Mock;
    expect(createClientMock).toHaveBeenCalledTimes(1);
    expect(mockClient.connect).toHaveBeenCalledTimes(1);
    expect(mockClient.disconnect).toHaveBeenCalledTimes(1);
  });
});
