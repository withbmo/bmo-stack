import {
  CONFIG_MODE,
  EC2_ARCHITECTURE,
  MARKET_TYPE,
  ORCHESTRATOR_STATUS,
  ROOT_VOLUME_TYPE,
} from '@pytholit/contracts';
import { DeleteItemCommand, DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import {
  DescribeInstancesCommand,
  DescribeInstanceTypesCommand,
  type DescribeInstanceTypesCommandOutput,
  EC2Client,
  RunInstancesCommand,
  StopInstancesCommand,
  TerminateInstancesCommand,
} from '@aws-sdk/client-ec2';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import type { ConnectionOptions } from 'bullmq';
import { Job, Queue, Worker } from 'bullmq';
import dotenv from 'dotenv';
import Fastify from 'fastify';
import path from 'path';
import { timingSafeEqual } from 'crypto';

const app = Fastify({ logger: true });

// Load local env file for `pnpm --filter @pytholit/env-orchestrator dev`.
// In Docker/ECS, env vars are injected and this is a no-op.
dotenv.config({
  path: process.env.ENV_ORCHESTRATOR_ENV_FILE || path.resolve(__dirname, '../.env'),
});

const API_URL = process.env.API_URL || '';
const INTERNAL_SECRET = process.env.INTERNAL_SECRET || '';
const REDIS_URL = process.env.REDIS_URL || '';

// EC2 instance tag key used to identify which environment an instance belongs to
const ENV_ID_TAG = 'pytholit:envId';

type PollUntilRunningJobData = {
  envId: string;
  instanceId: string;
  region: string;
  dynamodbTable: string;
  envDomainSuffix: string;
};
// BullMQ queue names cannot contain ":".
const POLL_QUEUE_NAME = 'env-orchestrator-poll-until-running';
const POLL_JOB_NAME = 'poll';
const POLL_JOB_ID_PREFIX = 'poll:env:';

let pollQueue: Queue | null = null;
let pollWorker: Worker | null = null;

type OrchestratorStartRequest = {
  envId: string;
  instanceName?: string;
  region: string;
  architecture?: (typeof EC2_ARCHITECTURE)[keyof typeof EC2_ARCHITECTURE];
  marketType: (typeof MARKET_TYPE)[keyof typeof MARKET_TYPE];
  mode: (typeof CONFIG_MODE)[keyof typeof CONFIG_MODE];
  preset?: { instanceType: string };
  custom?: { vcpu: number; memoryMiB: number };
  rootVolume: { sizeGiB: number; type: (typeof ROOT_VOLUME_TYPE)[keyof typeof ROOT_VOLUME_TYPE] };
  infra: {
    subnetId: string;
    securityGroupIds: string[];
    amiId: string;
    instanceProfileName: string;
    userDataBase64?: string | null;
    dynamodbTable: string;
    envDomainSuffix: string;
  };
};

type OrchestratorBasicRequest = {
  envId: string;
  region: string;
  infra: { dynamodbTable: string; envDomainSuffix: string };
};

const ec2Clients = new Map<string, EC2Client>();
const ddbClients = new Map<string, DynamoDBClient>();

function getEc2(region: string): EC2Client {
  const cached = ec2Clients.get(region);
  if (cached) return cached;
  const client = new EC2Client({ region });
  ec2Clients.set(region, client);
  return client;
}

function getDdb(region: string): DynamoDBClient {
  const cached = ddbClients.get(region);
  if (cached) return cached;
  const client = new DynamoDBClient({ region });
  ddbClients.set(region, client);
  return client;
}

async function findInstanceByEnvId(ec2: EC2Client, envId: string): Promise<string | null> {
  const result = await ec2.send(
    new DescribeInstancesCommand({
      Filters: [
        { Name: `tag:${ENV_ID_TAG}`, Values: [envId] },
        {
          Name: 'instance-state-name',
          Values: ['pending', 'running', 'stopping', 'stopped'],
        },
      ],
    })
  );
  for (const reservation of result.Reservations ?? []) {
    for (const instance of reservation.Instances ?? []) {
      if (instance.InstanceId) return instance.InstanceId;
    }
  }
  return null;
}

async function updateDynamoRouting(
  ddb: DynamoDBClient,
  dynamodbTable: string,
  envDomainSuffix: string,
  envId: string,
  privateIp: string,
  instanceId: string
): Promise<void> {
  const host = `${envId}.${envDomainSuffix}`;
  await ddb.send(
    new PutItemCommand({
      TableName: dynamodbTable,
      Item: {
        host: { S: host },
        envId: { S: envId },
        privateIp: { S: privateIp },
        instanceId: { S: instanceId },
        updatedAt: { S: new Date().toISOString() },
      },
    })
  );
}

async function deleteDynamoRouting(
  ddb: DynamoDBClient,
  dynamodbTable: string,
  envDomainSuffix: string,
  envId: string
): Promise<void> {
  const host = `${envId}.${envDomainSuffix}`;
  await ddb.send(
    new DeleteItemCommand({
      TableName: dynamodbTable,
      Key: { host: { S: host } },
    })
  );
}

async function callbackApiStatus(
  envId: string,
  status: string,
  details: Record<string, unknown>
): Promise<void> {
  if (!API_URL || !INTERNAL_SECRET) return;
  const url = `${API_URL}/api/v1/environments/${envId}/orchestrator-status`;
  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': INTERNAL_SECRET,
      },
      body: JSON.stringify({ status, details }),
    });
  } catch (err) {
    app.log.error({ err, envId }, 'Failed to call API status callback');
  }
}

async function pollUntilRunning(
  region: string,
  dynamodbTable: string,
  envDomainSuffix: string,
  envId: string,
  instanceId: string
): Promise<void> {
  const maxAttempts = 60;
  const intervalMs = 10_000;
  const ec2 = getEc2(region);
  const ddb = getDdb(region);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise(resolve => setTimeout(resolve, intervalMs));

    try {
      const result = await ec2.send(new DescribeInstancesCommand({ InstanceIds: [instanceId] }));
      const instance = result.Reservations?.[0]?.Instances?.[0];

      if (!instance) {
        await callbackApiStatus(envId, ORCHESTRATOR_STATUS.FAILED, {
          message: 'Instance not found during status polling',
          instanceId,
        });
        return;
      }

      const state = instance.State?.Name;

      if (state === 'running') {
        const privateIp = instance.PrivateIpAddress ?? '';
        if (privateIp) {
          await updateDynamoRouting(
            ddb,
            dynamodbTable,
            envDomainSuffix,
            envId,
            privateIp,
            instanceId
          );
        }
        await callbackApiStatus(envId, ORCHESTRATOR_STATUS.READY, { instanceId, privateIp, region });
        return;
      }

      if (state === 'terminated' || state === 'shutting-down') {
        await callbackApiStatus(envId, ORCHESTRATOR_STATUS.FAILED, {
          message: `Instance entered unexpected state: ${state}`,
          instanceId,
        });
        return;
      }

      app.log.info({ envId, instanceId, state, attempt }, 'Instance not yet running, polling...');
    } catch (err) {
      app.log.warn({ err, envId, instanceId, attempt }, 'Error polling instance status');
    }
  }

  await callbackApiStatus(envId, ORCHESTRATOR_STATUS.FAILED, {
    message: 'Timeout: instance did not become running within 10 minutes',
    instanceId,
    region,
  });
}

async function pollUntilStopped(
  region: string,
  dynamodbTable: string,
  envDomainSuffix: string,
  envId: string,
  instanceId: string
): Promise<void> {
  const maxAttempts = 60;
  const intervalMs = 10_000;
  const ec2 = getEc2(region);
  const ddb = getDdb(region);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise(resolve => setTimeout(resolve, intervalMs));

    try {
      const result = await ec2.send(new DescribeInstancesCommand({ InstanceIds: [instanceId] }));
      const instance = result.Reservations?.[0]?.Instances?.[0];

      if (!instance) {
        await deleteDynamoRouting(ddb, dynamodbTable, envDomainSuffix, envId).catch(err => {
          app.log.warn({ err, envId }, 'Failed to delete DynamoDB routing entry');
        });
        await callbackApiStatus(envId, ORCHESTRATOR_STATUS.STOPPED, {
          instanceId,
          region,
          message: 'Instance not found; treated as stopped',
        });
        return;
      }

      const state = instance.State?.Name;

      if (state === 'stopped') {
        await deleteDynamoRouting(ddb, dynamodbTable, envDomainSuffix, envId).catch(err => {
          app.log.warn({ err, envId }, 'Failed to delete DynamoDB routing entry');
        });
        await callbackApiStatus(envId, ORCHESTRATOR_STATUS.STOPPED, { instanceId, region });
        return;
      }

      if (state === 'terminated' || state === 'shutting-down') {
        await deleteDynamoRouting(ddb, dynamodbTable, envDomainSuffix, envId).catch(err => {
          app.log.warn({ err, envId }, 'Failed to delete DynamoDB routing entry');
        });
        await callbackApiStatus(envId, ORCHESTRATOR_STATUS.TERMINATED, {
          instanceId,
          region,
          message: `Instance entered state: ${state}`,
        });
        return;
      }

      app.log.info({ envId, instanceId, state, attempt }, 'Instance not yet stopped, polling...');
    } catch (err) {
      app.log.warn({ err, envId, instanceId, attempt }, 'Error polling instance stop status');
    }
  }

  await callbackApiStatus(envId, ORCHESTRATOR_STATUS.FAILED, {
    message: 'Timeout: instance did not become stopped within 10 minutes',
    instanceId,
    region,
  });
}

async function pollUntilTerminated(
  region: string,
  dynamodbTable: string,
  envDomainSuffix: string,
  envId: string,
  instanceId: string
): Promise<void> {
  const maxAttempts = 60;
  const intervalMs = 10_000;
  const ec2 = getEc2(region);
  const ddb = getDdb(region);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise(resolve => setTimeout(resolve, intervalMs));

    try {
      const result = await ec2.send(new DescribeInstancesCommand({ InstanceIds: [instanceId] }));
      const instance = result.Reservations?.[0]?.Instances?.[0];

      if (!instance) {
        await deleteDynamoRouting(ddb, dynamodbTable, envDomainSuffix, envId).catch(err => {
          app.log.warn({ err, envId }, 'Failed to delete DynamoDB routing entry');
        });
        await callbackApiStatus(envId, ORCHESTRATOR_STATUS.TERMINATED, {
          instanceId,
          region,
          message: 'Instance not found; treated as terminated',
        });
        return;
      }

      const state = instance.State?.Name;

      if (state === 'terminated') {
        await deleteDynamoRouting(ddb, dynamodbTable, envDomainSuffix, envId).catch(err => {
          app.log.warn({ err, envId }, 'Failed to delete DynamoDB routing entry');
        });
        await callbackApiStatus(envId, ORCHESTRATOR_STATUS.TERMINATED, { instanceId, region });
        return;
      }

      if (state === 'shutting-down') {
        app.log.info({ envId, instanceId, attempt }, 'Instance shutting down, polling...');
        continue;
      }

      app.log.info({ envId, instanceId, state, attempt }, 'Instance not yet terminated, polling...');
    } catch (err) {
      app.log.warn({ err, envId, instanceId, attempt }, 'Error polling instance terminate status');
    }
  }

  await callbackApiStatus(envId, ORCHESTRATOR_STATUS.FAILED, {
    message: 'Timeout: instance did not become terminated within 10 minutes',
    instanceId,
    region,
  });
}

async function initPollQueue(): Promise<void> {
  if (!REDIS_URL) {
    app.log.warn('REDIS_URL not set; poll jobs will run in-memory (not restart-safe)');
    return;
  }

  const connection: ConnectionOptions = { url: REDIS_URL, maxRetriesPerRequest: null };

  pollQueue = new Queue(POLL_QUEUE_NAME, { connection });

  const processor = async (job: Job<PollUntilRunningJobData>) => {
    const { envId, instanceId, region, dynamodbTable, envDomainSuffix } = job.data;
    const ec2 = getEc2(region);
    const ddb = getDdb(region);

    const result = await ec2.send(new DescribeInstancesCommand({ InstanceIds: [instanceId] }));
    const instance = result.Reservations?.[0]?.Instances?.[0];

    if (!instance) {
      await callbackApiStatus(envId, 'failed', {
        message: 'Instance not found during status polling',
        instanceId,
      });
      return;
    }

    const state = instance.State?.Name;

    if (state === 'running') {
      const privateIp = instance.PrivateIpAddress ?? '';
      if (privateIp) {
        await updateDynamoRouting(
          ddb,
          dynamodbTable,
          envDomainSuffix,
          envId,
          privateIp,
          instanceId
        );
      }
      await callbackApiStatus(envId, 'ready', { instanceId, privateIp, region });
      return;
    }

    if (state === 'terminated' || state === 'shutting-down') {
      await callbackApiStatus(envId, 'failed', {
        message: `Instance entered unexpected state: ${state}`,
        instanceId,
      });
      return;
    }

    await job.updateProgress({ state: state ?? ORCHESTRATOR_STATUS.UNKNOWN });
    throw new Error('POLL_RETRY:not_running');
  };

  pollWorker = new Worker(POLL_QUEUE_NAME, processor, { connection });

  pollWorker.on('failed', (job, err) => {
    const envId = job?.data?.envId;
    const instanceId = job?.data?.instanceId;
    const region = job?.data?.region;

    const attempts = job?.opts?.attempts ?? 1;
    const finalFailure = !!job && job.attemptsMade >= attempts;
    const errMsg = String((err as Error)?.message ?? err);

    if (!finalFailure && errMsg.startsWith('POLL_RETRY:')) return;

    if (!finalFailure) {
      app.log.warn(
        { err, envId, instanceId, attemptsMade: job?.attemptsMade },
        'Poll job failed; will retry'
      );
      return;
    }

    app.log.error({ err, envId, instanceId }, 'Poll job failed permanently');
    if (!envId || !instanceId) return;
    void callbackApiStatus(envId, ORCHESTRATOR_STATUS.FAILED, {
      message: 'Timeout: instance did not become running within 10 minutes',
      instanceId,
      region,
    });
  });

  pollWorker.on('error', err => {
    app.log.error({ err }, 'Poll worker error');
  });
}

async function enqueuePollJob(data: PollUntilRunningJobData): Promise<boolean> {
  if (!pollQueue) return false;

  const jobId = `${POLL_JOB_ID_PREFIX}${data.envId}`;
  const existing = await pollQueue.getJob(jobId);
  if (existing) {
    const existingData = existing.data as PollUntilRunningJobData;
    if (existingData.instanceId !== data.instanceId || existingData.region !== data.region) {
      await existing.remove().catch(() => {});
    } else {
      return true;
    }
  }

  try {
    await pollQueue.add(POLL_JOB_NAME, data, {
      jobId,
      attempts: 60,
      backoff: { type: 'fixed', delay: 10_000 },
      removeOnComplete: true,
      removeOnFail: 100,
    });
    return true;
  } catch (err) {
    const msg = String((err as Error).message ?? err);
    if (msg.includes('Job') && msg.includes('exists')) return true;
    app.log.warn(
      { err, envId: data.envId, instanceId: data.instanceId },
      'Failed to enqueue poll job'
    );
    return false;
  }
}

function requireInternalSecret(request: any): void {
  const header = (request.headers?.['x-internal-secret'] ||
    request.headers?.['X-Internal-Secret']) as string | undefined;
  if (!INTERNAL_SECRET || !header) {
    const err = new Error('Forbidden');
    (err as any).statusCode = 403;
    throw err;
  }
  const expectedBuffer = Buffer.from(INTERNAL_SECRET, 'utf8');
  const actualBuffer = Buffer.from(header, 'utf8');
  if (expectedBuffer.length !== actualBuffer.length || !timingSafeEqual(expectedBuffer, actualBuffer)) {
    const err = new Error('Forbidden');
    (err as any).statusCode = 403;
    throw err;
  }
}

type InstanceTypeLite = {
  instanceType: string;
  vcpu: number;
  memoryMiB: number;
  archs: string[];
};
type InstanceTypeCacheState =
  | { status: 'ready'; fetchedAtMs: number; types: InstanceTypeLite[] }
  | { status: 'warming'; startedAtMs: number; promise: Promise<void> };

const instanceTypeCache = new Map<string, InstanceTypeCacheState>();
const INSTANCE_TYPE_CACHE_TTL_MS = 60 * 60 * 1000;
const INSTANCE_TYPE_WARMUP_REGIONS = (process.env.INSTANCE_TYPE_WARMUP_REGIONS || 'us-east-1')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

function isAllowedInstanceType(instanceType: string): boolean {
  // Keep the list usable for dev environments by hiding GPU/inference/training/bare-metal and other "odd" families.
  // Important: do NOT blanket-deny arm64 families (t4g/m6g/...) because the UI supports arm64.
  const deny = /(^g\d|^p\d|^inf\d|^trn\d|metal$|^u-|^x2|^x1|^z1d\.|^f1\.|^dl1\.|^vt1\.|^mac\d\.)/i;
  return !deny.test(instanceType);
}

async function fetchAllInstanceTypes(region: string): Promise<InstanceTypeLite[]> {
  const ec2 = getEc2(region);
  const types: InstanceTypeLite[] = [];
  let nextToken: string | undefined = undefined;

  do {
    const res: DescribeInstanceTypesCommandOutput = await ec2.send(
      new DescribeInstanceTypesCommand({ NextToken: nextToken, MaxResults: 100 })
    );
    for (const t of res.InstanceTypes ?? []) {
      const instanceType = t.InstanceType;
      const vcpu = t.VCpuInfo?.DefaultVCpus;
      const memoryMiB = t.MemoryInfo?.SizeInMiB;
      const archs = t.ProcessorInfo?.SupportedArchitectures ?? [];

      if (!instanceType || !vcpu || !memoryMiB) continue;
      if (!isAllowedInstanceType(instanceType)) continue;
      types.push({ instanceType, vcpu, memoryMiB, archs });
    }
    nextToken = res.NextToken;
  } while (nextToken);

  types.sort(
    (a, b) =>
      a.vcpu - b.vcpu || a.memoryMiB - b.memoryMiB || a.instanceType.localeCompare(b.instanceType)
  );
  return types;
}

function warmInstanceTypes(region: string): InstanceTypeCacheState {
  const now = Date.now();
  const cached = instanceTypeCache.get(region);
  if (cached?.status === 'warming') return cached;

  const promise = (async () => {
    try {
      const types = await fetchAllInstanceTypes(region);
      instanceTypeCache.set(region, { status: 'ready', fetchedAtMs: Date.now(), types });
      app.log.info({ region, count: types.length }, 'Instance type catalog warmed');
    } catch (err) {
      instanceTypeCache.delete(region);
      app.log.error({ err, region }, 'Failed to warm instance type catalog');
    }
  })();

  const warming: InstanceTypeCacheState = { status: 'warming', startedAtMs: now, promise };
  instanceTypeCache.set(region, warming);
  return warming;
}

function getCachedInstanceTypes(
  region: string
): { state: 'ready'; types: InstanceTypeLite[]; stale: boolean } | { state: 'warming' } {
  const now = Date.now();
  const cached = instanceTypeCache.get(region);

  if (!cached) {
    warmInstanceTypes(region);
    return { state: 'warming' };
  }

  if (cached.status === 'warming') {
    return { state: 'warming' };
  }

  const stale = now - cached.fetchedAtMs >= INSTANCE_TYPE_CACHE_TTL_MS;
  if (stale) {
    // Stale-while-revalidate: serve existing cache and refresh in background.
    warmInstanceTypes(region);
  }

  return { state: 'ready', types: cached.types, stale };
}

async function selectInstanceType(
  region: string,
  arch: 'x86_64' | 'arm64',
  vcpu: number,
  memoryMiB: number
): Promise<string> {
  const cached = getCachedInstanceTypes(region);
  if (cached.state !== 'ready') {
    throw new Error(`Instance type catalog is warming for ${region}; retry shortly`);
  }
  const types = cached.types;
  const candidate = types.find(
    t => t.archs.includes(arch) && t.vcpu >= vcpu && t.memoryMiB >= memoryMiB
  );
  if (!candidate) {
    throw new Error(
      `No instance type found for >=${vcpu} vCPU and >=${memoryMiB} MiB RAM (${arch}) in ${region}`
    );
  }
  return candidate.instanceType;
}

async function bootstrap() {
  await app.register(helmet);
  await app.register(cors, { origin: true });

  if (!INTERNAL_SECRET) {
    app.log.error(
      'INTERNAL_SECRET is required to run env-orchestrator (secures /internal/* routes).'
    );
    process.exit(1);
  }
  if (!API_URL) {
    app.log.warn('API_URL not set; orchestrator status callbacks to the API are disabled.');
  }

  await initPollQueue();

  app.get('/health', async () => ({ status: 'ok', service: 'env-orchestrator' }));

  app.post('/internal/environments/:id/start', async (request, reply) => {
    requireInternalSecret(request);
    const { id } = request.params as { id: string };
    const body = (request.body ?? {}) as Partial<OrchestratorStartRequest>;

    if (!body.envId || body.envId !== id) {
      reply.status(400);
      return { ok: false, environmentId: id, message: 'Invalid envId' };
    }

    const region = body.region;
    if (!region) {
      reply.status(400);
      return { ok: false, environmentId: id, message: 'Missing region' };
    }
    const arch = body.architecture === EC2_ARCHITECTURE.ARM64 ? EC2_ARCHITECTURE.ARM64 : EC2_ARCHITECTURE.X86_64;
    const infra = body.infra;
    if (
      !infra?.subnetId ||
      !infra?.amiId ||
      !infra?.instanceProfileName ||
      !Array.isArray(infra.securityGroupIds) ||
      infra.securityGroupIds.length === 0 ||
      !infra.dynamodbTable ||
      !infra.envDomainSuffix
    ) {
      reply.status(400);
      return { ok: false, environmentId: id, message: 'Missing infra config' };
    }

    const ec2 = getEc2(region);

    // Idempotency: if an instance for this env already exists, return its ID
    const existingId = await findInstanceByEnvId(ec2, id);
    if (existingId) {
      const enqueued = await enqueuePollJob({
        envId: id,
        instanceId: existingId,
        region,
        dynamodbTable: infra.dynamodbTable,
        envDomainSuffix: infra.envDomainSuffix,
      });
      if (!enqueued) {
        pollUntilRunning(region, infra.dynamodbTable, infra.envDomainSuffix, id, existingId).catch(
          err => {
            app.log.error({ err, envId: id, instanceId: existingId }, 'Background polling error');
            callbackApiStatus(id, ORCHESTRATOR_STATUS.FAILED, {
              message: String(err),
              instanceId: existingId,
              region,
            }).catch(() => {});
          }
        );
      }
      return {
        ok: true,
        environmentId: id,
        state: ORCHESTRATOR_STATUS.STARTING,
        instanceId: existingId,
        message: 'Instance already exists',
      };
    }

    const instanceType =
      body.mode === CONFIG_MODE.PRESET
        ? body.preset?.instanceType
        : body.custom
          ? await selectInstanceType(region, arch, body.custom.vcpu, body.custom.memoryMiB)
          : null;
    if (!instanceType) {
      reply.status(400);
      return { ok: false, environmentId: id, message: 'Missing instance type selection data' };
    }

    const root = body.rootVolume;
    if (!root || !root.sizeGiB || !root.type) {
      reply.status(400);
      return { ok: false, environmentId: id, message: 'Missing rootVolume' };
    }

    const result = await ec2.send(
      new RunInstancesCommand({
        ImageId: infra.amiId,
        InstanceType: instanceType as any,
        IamInstanceProfile: { Name: infra.instanceProfileName },
        MinCount: 1,
        MaxCount: 1,
        SubnetId: infra.subnetId,
        SecurityGroupIds: infra.securityGroupIds,
        UserData: infra.userDataBase64 ?? undefined,
        BlockDeviceMappings: [
          {
            DeviceName: '/dev/sda1',
            Ebs: {
              VolumeSize: root.sizeGiB,
              VolumeType: root.type,
              DeleteOnTermination: true,
            },
          },
        ],
        InstanceMarketOptions:
          body.marketType === MARKET_TYPE.SPOT
            ? { MarketType: 'spot', SpotOptions: { SpotInstanceType: 'one-time' } }
            : undefined,
        TagSpecifications: [
          {
            ResourceType: 'instance',
            Tags: [
              { Key: ENV_ID_TAG, Value: id },
              { Key: 'Name', Value: body.instanceName?.trim() ? body.instanceName.trim() : `env-${id}` },
            ],
          },
        ],
      })
    );

    const instanceId = result.Instances?.[0]?.InstanceId;
    if (!instanceId) {
      reply.status(500);
      return { ok: false, environmentId: id, message: 'RunInstances returned no instance ID' };
    }

    // Poll in the background; prefer Redis-backed jobs for restart safety.
    const enqueued = await enqueuePollJob({
      envId: id,
      instanceId,
      region,
      dynamodbTable: infra.dynamodbTable,
      envDomainSuffix: infra.envDomainSuffix,
    });
    if (!enqueued) {
      pollUntilRunning(region, infra.dynamodbTable, infra.envDomainSuffix, id, instanceId).catch(
        err => {
          app.log.error({ err, envId: id, instanceId }, 'Background polling error');
          callbackApiStatus(id, ORCHESTRATOR_STATUS.FAILED, { message: String(err), instanceId, region }).catch(
            () => {}
          );
        }
      );
    }

    return {
      ok: true,
      environmentId: id,
      state: ORCHESTRATOR_STATUS.STARTING,
      instanceId,
      message: 'Instance launch initiated',
    };
  });

  app.post('/internal/environments/:id/stop', async (request, reply) => {
    requireInternalSecret(request);
    const { id } = request.params as { id: string };
    const body = (request.body ?? {}) as Partial<OrchestratorBasicRequest>;
    if (
      !body.envId ||
      body.envId !== id ||
      !body.region ||
      !body.infra?.dynamodbTable ||
      !body.infra?.envDomainSuffix
    ) {
      reply.status(400);
      return { ok: false, environmentId: id, message: 'Invalid request' };
    }
    const ec2 = getEc2(body.region);
    const ddb = getDdb(body.region);

    const instanceId = await findInstanceByEnvId(ec2, id);
    if (!instanceId) {
      await deleteDynamoRouting(
        ddb,
        body.infra.dynamodbTable,
        body.infra.envDomainSuffix,
        id
      ).catch(err => {
        app.log.warn({ err, envId: id }, 'Failed to delete DynamoDB routing entry');
      });
      await callbackApiStatus(id, ORCHESTRATOR_STATUS.STOPPED, {
        region: body.region,
        message: 'No running instance found for this environment',
      }).catch(() => {});
      return {
        ok: true,
        environmentId: id,
        state: ORCHESTRATOR_STATUS.STOPPED,
        message: 'No running instance found for this environment',
      };
    }

    await ec2.send(new StopInstancesCommand({ InstanceIds: [instanceId] }));

    pollUntilStopped(
      body.region,
      body.infra.dynamodbTable,
      body.infra.envDomainSuffix,
      id,
      instanceId
    ).catch(err => {
      app.log.error({ err, envId: id, instanceId }, 'Background stop polling error');
      callbackApiStatus(id, ORCHESTRATOR_STATUS.FAILED, {
        message: String(err),
        instanceId,
        region: body.region,
      }).catch(() => {});
    });

    return {
      ok: true,
      environmentId: id,
      state: ORCHESTRATOR_STATUS.STOPPING,
      instanceId,
      message: 'Stop initiated',
    };
  });

  app.post('/internal/environments/:id/terminate', async (request, reply) => {
    requireInternalSecret(request);
    const { id } = request.params as { id: string };
    const body = (request.body ?? {}) as Partial<OrchestratorBasicRequest>;
    if (
      !body.envId ||
      body.envId !== id ||
      !body.region ||
      !body.infra?.dynamodbTable ||
      !body.infra?.envDomainSuffix
    ) {
      reply.status(400);
      return { ok: false, environmentId: id, message: 'Invalid request' };
    }
    const ec2 = getEc2(body.region);
    const ddb = getDdb(body.region);

    const instanceId = await findInstanceByEnvId(ec2, id);
    if (!instanceId) {
      // Nothing to terminate; ensure routing is cleaned up and mark terminated.
      await deleteDynamoRouting(ddb, body.infra.dynamodbTable, body.infra.envDomainSuffix, id).catch(
        err => {
          app.log.warn({ err, envId: id }, 'Failed to delete DynamoDB routing entry');
        }
      );
      await callbackApiStatus(id, ORCHESTRATOR_STATUS.TERMINATED, {
        region: body.region,
        message: 'No running instance found for this environment',
      }).catch(() => {});
      return {
        ok: true,
        environmentId: id,
        state: ORCHESTRATOR_STATUS.TERMINATED,
        message: 'No running instance found for this environment',
      };
    }

    await ec2.send(new TerminateInstancesCommand({ InstanceIds: [instanceId] }));

    // Clean up routing table entry immediately so the host stops routing to a dead instance.
    await deleteDynamoRouting(ddb, body.infra.dynamodbTable, body.infra.envDomainSuffix, id).catch(
      err => {
        app.log.warn({ err, envId: id }, 'Failed to delete DynamoDB routing entry');
      }
    );

    pollUntilTerminated(
      body.region,
      body.infra.dynamodbTable,
      body.infra.envDomainSuffix,
      id,
      instanceId
    ).catch(err => {
      app.log.error({ err, envId: id, instanceId }, 'Background terminate polling error');
      callbackApiStatus(id, ORCHESTRATOR_STATUS.FAILED, {
        message: String(err),
        instanceId,
        region: body.region,
      }).catch(() => {});
    });

    return {
      ok: true,
      environmentId: id,
      state: ORCHESTRATOR_STATUS.TERMINATING,
      instanceId,
      message: 'Termination initiated',
    };
  });

  app.get('/internal/environments/:id/status', async (request, reply) => {
    requireInternalSecret(request);
    const { id } = request.params as { id: string };
    const region = (request.query as any)?.region as string | undefined;
    if (!region) {
      reply.status(400);
      return { ok: false, environmentId: id, message: 'Missing region query param' };
    }
    const ec2 = getEc2(region);

    const result = await ec2.send(
      new DescribeInstancesCommand({
        Filters: [
          { Name: `tag:${ENV_ID_TAG}`, Values: [id] },
          {
            Name: 'instance-state-name',
            Values: ['pending', 'running', 'stopping', 'stopped'],
          },
        ],
      })
    );

    const instance = result.Reservations?.[0]?.Instances?.[0];
    if (!instance) {
      return { environmentId: id, state: ORCHESTRATOR_STATUS.UNKNOWN, lastUpdated: new Date().toISOString() };
    }

    return {
      environmentId: id,
      state: instance.State?.Name ?? ORCHESTRATOR_STATUS.UNKNOWN,
      instanceId: instance.InstanceId,
      privateIp: instance.PrivateIpAddress,
      lastUpdated: new Date().toISOString(),
    };
  });

  app.get('/internal/instance-types', async (request, reply) => {
    requireInternalSecret(request);
    const q = request.query as { region?: string; arch?: string; q?: string; limit?: string };
    const region = q.region;
    const arch = q.arch === EC2_ARCHITECTURE.ARM64 ? EC2_ARCHITECTURE.ARM64 : q.arch === EC2_ARCHITECTURE.X86_64 ? EC2_ARCHITECTURE.X86_64 : null;
    if (!region || !arch) {
      reply.status(400);
      return { ok: false, message: 'region and arch are required' };
    }
    const limit = Math.min(Math.max(Number(q.limit || '200') || 200, 1), 1000);
    const search = (q.q || '').toLowerCase().trim();

    const cached = getCachedInstanceTypes(region);
    if (cached.state !== 'ready') {
      reply.status(202);
      return {
        ok: false,
        warming: true,
        region,
        arch,
        retryAfterMs: 1000,
        message: 'Instance type catalog is warming',
      };
    }

    const filtered = cached.types
      .filter(t => t.archs.includes(arch))
      .filter(t => (search ? t.instanceType.toLowerCase().includes(search) : true))
      .slice(0, limit)
      .map(t => ({ instanceType: t.instanceType, vcpu: t.vcpu, memoryMiB: t.memoryMiB }));

    return { ok: true, region, arch, items: filtered, stale: cached.stale };
  });

  app.get('/internal/instance-type', async (request, reply) => {
    requireInternalSecret(request);
    const q = request.query as { region?: string; arch?: string; instanceType?: string };
    const region = q.region;
    const arch = q.arch === EC2_ARCHITECTURE.ARM64 ? EC2_ARCHITECTURE.ARM64 : q.arch === EC2_ARCHITECTURE.X86_64 ? EC2_ARCHITECTURE.X86_64 : null;
    const instanceType = (q.instanceType || '').trim();
    if (!region || !arch || !instanceType) {
      reply.status(400);
      return { ok: false, message: 'region, arch, and instanceType are required' };
    }

    const ec2 = getEc2(region);
    const res = await ec2.send(
      new DescribeInstanceTypesCommand({ InstanceTypes: [instanceType as any] })
    );
    const t = res.InstanceTypes?.[0];
    const returned = t?.InstanceType;
    const vcpu = t?.VCpuInfo?.DefaultVCpus;
    const memoryMiB = t?.MemoryInfo?.SizeInMiB;
    const archs = t?.ProcessorInfo?.SupportedArchitectures ?? [];

    if (!returned || !vcpu || !memoryMiB) {
      reply.status(400);
      return { ok: false, message: `Unsupported instance type ${instanceType} for ${region}` };
    }
    if (!archs.includes(arch)) {
      reply.status(400);
      return { ok: false, message: `Instance type ${instanceType} does not support ${arch}` };
    }
    if (!isAllowedInstanceType(returned)) {
      reply.status(400);
      return { ok: false, message: `Instance type ${instanceType} is not allowed` };
    }

    return { ok: true, region, arch, item: { instanceType: returned, vcpu, memoryMiB } };
  });

  const port = Number(process.env.PORT || 3003);
  await app.listen({ port, host: '0.0.0.0' });

  // Warm instance type catalog ASAP so the first UI search is less likely to hit a 503 warming response.
  // Best-effort: if AWS creds are missing, the endpoint will still warm on-demand when queried.
  for (const region of INSTANCE_TYPE_WARMUP_REGIONS) {
    try {
      warmInstanceTypes(region);
      app.log.info({ region }, 'Warming instance type catalog on startup');
    } catch (err) {
      app.log.warn({ err, region }, 'Failed to start instance type warmup');
    }
  }
}

void bootstrap();
