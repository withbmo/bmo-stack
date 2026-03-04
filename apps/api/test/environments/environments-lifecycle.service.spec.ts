import { ORCHESTRATOR_STATUS } from '@pytholit/contracts';

import { EnvironmentsLifecycleService } from '../../src/environments/services/environments-lifecycle.service';

describe('EnvironmentsLifecycleService running-env quota stale reconcile', () => {
  const makeService = (opts: { counts: number[] }) => {
    const prisma = {
      client: {
        environment: {
          count: jest.fn().mockImplementation(async () => opts.counts.shift() ?? 0),
          findUnique: jest.fn(),
        },
      },
    } as any;

    const prismaTx = {} as any;

    const envConfig = {
      circuitFailureThreshold: 3,
      circuitOpenDurationMs: 30_000,
      orchestratorUrl: 'http://localhost:3003',
      orchestratorTimeoutMs: 5000,
      internalSecret: 'secret',
    } as any;

    const billingAccess = {
      assertNotHardLocked: jest.fn().mockResolvedValue(undefined),
      getLimit: jest.fn(async (_userId: string, _key: string, fallback: number) => fallback),
    } as any;

    const statusReconcile = {
      reconcileStaleEnvironmentsForOwner: jest.fn().mockResolvedValue({ reconciled: 1 }),
    } as any;

    const crud = {} as any;
    const lock = {} as any;

    const service = new EnvironmentsLifecycleService(
      prisma,
      prismaTx,
      envConfig,
      billingAccess,
      statusReconcile,
      crud,
      lock,
    );

    return { service, prisma, billingAccess, statusReconcile };
  };

  it('reconciles stale states on-demand when start would be blocked, then allows', async () => {
    const { service, statusReconcile } = makeService({ counts: [1, 0] });

    await expect(
      (service as any).assertRunningEnvironmentsWithinPlan(
        'user_1',
        'env_1',
        ORCHESTRATOR_STATUS.STOPPED,
      ),
    ).resolves.toBeUndefined();

    expect(statusReconcile.reconcileStaleEnvironmentsForOwner).toHaveBeenCalledWith('user_1');
  });
});
