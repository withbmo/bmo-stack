import { Injectable } from '@nestjs/common';
import { Prisma, prisma } from '@pytholit/db';
import { ClsService } from 'nestjs-cls';

const PRISMA_TX_CONTEXT_KEY = 'prisma.tx';

@Injectable()
export class PrismaTxService {
  constructor(private readonly cls: ClsService) {}

  get client(): typeof prisma {
    const tx = this.cls.get<Prisma.TransactionClient>(PRISMA_TX_CONTEXT_KEY);
    return (tx as unknown as typeof prisma) ?? prisma;
  }

  async runInTransaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> {
    return prisma.$transaction(async (tx) =>
      this.cls.run(async () => {
        this.cls.set(PRISMA_TX_CONTEXT_KEY, tx);
        return fn(tx);
      })
    );
  }
}
