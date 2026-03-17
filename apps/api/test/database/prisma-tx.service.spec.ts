import type { Prisma } from '@pytholit/db';
import { ClsService } from 'nestjs-cls';

import { PrismaTxService } from '../../src/database/prisma-tx.service';

jest.mock('@pytholit/db', () => ({
  prisma: {
    $transaction: jest.fn(),
  },
}));

import { prisma as mockPrisma } from '@pytholit/db';

const mockTransaction = mockPrisma.$transaction as jest.Mock;

describe('PrismaTxService', () => {
  let service: PrismaTxService;
  let cls: ClsService;

  beforeEach(() => {
    jest.clearAllMocks();
    cls = {
      get: jest.fn().mockReturnValue(undefined),
      set: jest.fn(),
      run: jest.fn((fn: () => unknown) => Promise.resolve(fn())),
    } as unknown as ClsService;
    service = new PrismaTxService(cls);
  });

  describe('client', () => {
    it('returns default prisma client when no transaction is in context', () => {
      (cls.get as jest.Mock).mockReturnValue(undefined);

      const client = service.client;

      expect(cls.get).toHaveBeenCalledWith('prisma.tx');
      expect(client).toBe(mockPrisma);
    });

    it('returns transaction client when one is set in context', () => {
      const txClient = {} as Prisma.TransactionClient;
      (cls.get as jest.Mock).mockReturnValue(txClient);

      const client = service.client;

      expect(client).toBe(txClient);
    });
  });

  describe('runInTransaction', () => {
    it('runs the callback inside prisma.$transaction and sets tx in CLS', async () => {
      const txClient = {} as Prisma.TransactionClient;
      mockTransaction.mockImplementation(async (fn: (tx: Prisma.TransactionClient) => Promise<number>) => {
        return (cls.run as jest.Mock)(async () => {
          (cls.set as jest.Mock)('prisma.tx', txClient);
          return fn(txClient);
        });
      });

      const result = await service.runInTransaction(async (tx) => {
        expect(tx).toBe(txClient);
        return 42;
      });

      expect(result).toBe(42);
      expect(mockTransaction).toHaveBeenCalledTimes(1);
      expect(cls.set).toHaveBeenCalledWith('prisma.tx', txClient);
    });
  });
});
