import { prisma } from '@pytholit/db';

import { PrismaService } from '../../src/database/prisma.service';
import { PrismaTxService } from '../../src/database/prisma-tx.service';

jest.mock('@pytholit/db', () => ({
  prisma: {
    $connect: jest.fn().mockResolvedValue(undefined),
    $disconnect: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('PrismaService', () => {
  let service: PrismaService;
  const mockTxClient = {} as unknown as ReturnType<PrismaService['client']['$transaction'] extends (fn: (tx: infer T) => unknown) => unknown ? T : never>;

  beforeEach(() => {
    jest.clearAllMocks();
    const prismaTx = {
      get client() {
        return mockTxClient;
      },
    } as unknown as PrismaTxService;
    service = new PrismaService(prismaTx);
  });

  describe('client', () => {
    it('returns the client from PrismaTxService', () => {
      expect(service.client).toBe(mockTxClient);
    });
  });

  describe('onModuleInit', () => {
    const originalEnv = process.env;

    afterEach(() => {
      process.env = originalEnv;
    });

    it('throws in production when database env vars are not set', async () => {
      process.env = { ...originalEnv, NODE_ENV: 'production' };
      delete process.env.DB_HOST;
      delete process.env.DB_USERNAME;
      delete process.env.DB_PASSWORD;
      delete process.env.DB_NAME;

      await expect(service.onModuleInit()).rejects.toThrow(
        'DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, and DB_PASSWORD are required in production.'
      );
      expect(prisma.$connect).not.toHaveBeenCalled();
    });

    it('skips connect in non-production when database env vars are not set', async () => {
      process.env = { ...originalEnv, NODE_ENV: 'development' };
      delete process.env.DB_HOST;
      delete process.env.DB_USERNAME;
      delete process.env.DB_PASSWORD;
      delete process.env.DB_NAME;

      await service.onModuleInit();

      expect(prisma.$connect).not.toHaveBeenCalled();
    });

    it('calls $connect when database env vars are set', async () => {
      process.env = {
        ...originalEnv,
        DB_HOST: 'localhost',
        DB_USERNAME: 'u',
        DB_PASSWORD: 'p',
        DB_NAME: 'db',
      };

      await service.onModuleInit();

      expect(prisma.$connect).toHaveBeenCalledTimes(1);
    });
  });

  describe('onModuleDestroy', () => {
    const originalEnv = process.env;

    afterEach(() => {
      process.env = originalEnv;
    });

    it('skips disconnect when database env vars are not set', async () => {
      process.env = { ...originalEnv };
      delete process.env.DB_HOST;
      delete process.env.DB_USERNAME;
      delete process.env.DB_PASSWORD;
      delete process.env.DB_NAME;

      await service.onModuleDestroy();

      expect(prisma.$disconnect).not.toHaveBeenCalled();
    });

    it('calls $disconnect when database env vars are set', async () => {
      process.env = {
        ...originalEnv,
        DB_HOST: 'localhost',
        DB_USERNAME: 'u',
        DB_PASSWORD: 'p',
        DB_NAME: 'db',
      };

      await service.onModuleDestroy();

      expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
    });
  });
});
