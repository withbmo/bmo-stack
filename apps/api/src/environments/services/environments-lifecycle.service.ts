import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    ServiceUnavailableException,
} from '@nestjs/common';
import type { OrchestratorStatus, ServerPreset } from '@pytholit/contracts';
import {
    CONFIG_MODE,
    EC2_ARCHITECTURE,
    ENVIRONMENT_REGION,
    MARKET_TYPE,
    ORCHESTRATOR_STATUS,
    ROOT_VOLUME_TYPE,
    SERVER_PRESETS,
} from '@pytholit/contracts';
import type { Environment, Prisma } from '@pytholit/db';
import { BillingAccessService } from '../../billing/billing-access.service';
import { DistributedLockService } from '../../common/services/distributed-lock.service';
import { PrismaService } from '../../database/prisma.service';
import { PrismaTxService } from '../../database/prisma-tx.service';
import { EnvironmentsConfigService } from '../environments.config';
import { SimpleCircuitBreaker } from '../orchestrator-circuit-breaker';
import {
    DEFAULT_DISK_GIB,
    MSG_LAUNCH_INITIATED,
    MSG_START_REQUESTED,
    MSG_STOP_REQUESTED,
    MSG_TERMINATE_REQUESTED,
} from '../environments.constants';
import { EnvironmentsCrudService } from './environments-crud.service';
import { EnvironmentsStatusReconcileService } from './environments-status-reconcile.service';
import * as EnvironmentsUtils from '../environments.utils';

// Types moved from the main service file
interface OrchestratorInstanceTypesResponse {
    ok?: boolean;
    warming?: boolean;
    items?: Array<{ instanceType: string; vcpu: number; memoryMiB: number }>;
}

interface OrchestratorInstanceTypeResponse {
    ok?: boolean;
    item?: { instanceType: string; vcpu: number; memoryMiB: number };
}

interface EnvironmentConfigCustom {
    cpuCores?: number;
    memory?: { size?: number; unit?: 'GB' | 'TB' };
    storage?: { size?: number; unit?: 'GB' | 'TB'; type?: 'SSD' | 'HDD' };
}

interface EnvironmentConfigServerPreset {
    instanceType?: string;
    storage?: unknown;
}

type OrchestratorStartRequest = {
    envId: string;
    instanceName?: string;
    region: string;
    architecture: (typeof EC2_ARCHITECTURE)[keyof typeof EC2_ARCHITECTURE];
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
    infra: {
        dynamodbTable: string;
        envDomainSuffix: string;
    };
};

@Injectable()
export class EnvironmentsLifecycleService {
    private static readonly LIFECYCLE_LOCK_TTL_MS = 30 * 1000;
    private readonly orchestratorBreaker: SimpleCircuitBreaker;

    constructor(
        private readonly prisma: PrismaService,
        private readonly prismaTx: PrismaTxService,
        private readonly envConfig: EnvironmentsConfigService,
        private readonly billingAccess: BillingAccessService,
        private readonly statusReconcile: EnvironmentsStatusReconcileService,
        private readonly crudService: EnvironmentsCrudService,
        private readonly lockService: DistributedLockService
    ) {
        this.orchestratorBreaker = new SimpleCircuitBreaker({
            failureThreshold: this.envConfig.circuitFailureThreshold,
            openDurationMs: this.envConfig.circuitOpenDurationMs,
        });
    }

    async startEnvironment(
        userId: string,
        environmentId: string
    ): Promise<{ message: string; status: string }> {
        const userLock = await this.lockService.runWithLock(
            this.userStartLockResource(userId),
            EnvironmentsLifecycleService.LIFECYCLE_LOCK_TTL_MS,
            async () => {
                const lock = await this.lockService.runWithLock(
                    this.lifecycleLockResource(environmentId),
                    EnvironmentsLifecycleService.LIFECYCLE_LOCK_TTL_MS,
                    () => this.startEnvironmentInsideLock(userId, environmentId)
                );
                if (!lock.acquired) {
                    throw new ConflictException('Another environment lifecycle operation is already in progress');
                }
                return lock.result;
            }
        );
        if (!userLock.acquired) {
            throw new ConflictException('Another environment start is already in progress');
        }
        return userLock.result;
    }

    private async startEnvironmentInsideLock(
        userId: string,
        environmentId: string
    ): Promise<{ message: string; status: string }> {
        const env = await this.getOwnedEnvironmentOrThrow(userId, environmentId);
        await this.assertRunningEnvironmentsWithinPlan(userId, environmentId, env.orchestratorStatus);

        await this.updateOrchestrator(userId, environmentId, {
            status: ORCHESTRATOR_STATUS.QUEUED,
            message: MSG_START_REQUESTED,
        });

        let resp: Record<string, unknown> | null = null;
        try {
            const body = await this.buildOrchestratorStartRequest(userId, env);

            resp = await this.callOrchestrator('POST', `/internal/environments/${environmentId}/start`, {
                headers: { 'x-internal-secret': this.requireInternalSecret() },
                body,
            });
        } catch (err) {
            await this.updateOrchestrator(userId, environmentId, {
                status: ORCHESTRATOR_STATUS.FAILED,
                message: `Failed to contact orchestrator: ${(err as Error).message}`,
            });
            throw err;
        }

        const instanceId = EnvironmentsUtils.readString(resp?.instanceId) ?? undefined;
        const config = EnvironmentsUtils.getConfig(env);
        const current = EnvironmentsUtils.getOrchestratorConfig(config);
        const now = new Date();
        await this.prisma.client.environment.update({
            where: { id: environmentId },
            data: {
                orchestratorStatus: ORCHESTRATOR_STATUS.STARTING,
                orchestratorStatusUpdatedAt: now,
                config: {
                    ...config,
                    orchestrator: {
                        ...current,
                        status: ORCHESTRATOR_STATUS.STARTING,
                        message: MSG_LAUNCH_INITIATED,
                        ts: now.toISOString(),
                        details: {
                            ...((current.details as Record<string, unknown>) ?? {}),
                            ...(instanceId ? { instanceId } : {}),
                        },
                    },
                },
            },
        });

        return { message: 'Environment start initiated', status: ORCHESTRATOR_STATUS.STARTING };
    }

    async stopEnvironment(
        userId: string,
        environmentId: string
    ): Promise<{ message: string; status: string }> {
        const lock = await this.lockService.runWithLock(
            this.lifecycleLockResource(environmentId),
            EnvironmentsLifecycleService.LIFECYCLE_LOCK_TTL_MS,
            () => this.stopEnvironmentInsideLock(userId, environmentId)
        );
        if (!lock.acquired) {
            throw new ConflictException('Another environment lifecycle operation is already in progress');
        }
        return lock.result;
    }

    private async stopEnvironmentInsideLock(
        userId: string,
        environmentId: string
    ): Promise<{ message: string; status: string }> {
        await this.updateOrchestrator(userId, environmentId, {
            status: ORCHESTRATOR_STATUS.STOPPING,
            message: MSG_STOP_REQUESTED,
        });

        try {
            const env = (await this.crudService.findOne(userId, environmentId)) as unknown as Environment;
            const body = await this.buildOrchestratorBasicRequest(env);
            await this.callOrchestrator('POST', `/internal/environments/${environmentId}/stop`, {
                headers: { 'x-internal-secret': this.requireInternalSecret() },
                body,
            });
        } catch (err) {
            await this.updateOrchestrator(userId, environmentId, {
                status: ORCHESTRATOR_STATUS.FAILED,
                message: `Failed to contact orchestrator: ${(err as Error).message}`,
            });
            throw err;
        }

        return { message: MSG_STOP_REQUESTED, status: ORCHESTRATOR_STATUS.STOPPING };
    }

    async terminateEnvironment(
        userId: string,
        environmentId: string
    ): Promise<{ message: string; status: string }> {
        const lock = await this.lockService.runWithLock(
            this.lifecycleLockResource(environmentId),
            EnvironmentsLifecycleService.LIFECYCLE_LOCK_TTL_MS,
            () => this.terminateEnvironmentInsideLock(userId, environmentId)
        );
        if (!lock.acquired) {
            throw new ConflictException('Another environment lifecycle operation is already in progress');
        }
        return lock.result;
    }

    private async terminateEnvironmentInsideLock(
        userId: string,
        environmentId: string
    ): Promise<{ message: string; status: string }> {
        await this.updateOrchestrator(userId, environmentId, {
            status: ORCHESTRATOR_STATUS.TERMINATING,
            message: MSG_TERMINATE_REQUESTED,
        });

        try {
            const env = (await this.crudService.findOne(userId, environmentId)) as unknown as Environment;
            const body = await this.buildOrchestratorBasicRequest(env);
            await this.callOrchestrator('POST', `/internal/environments/${environmentId}/terminate`, {
                headers: { 'x-internal-secret': this.requireInternalSecret() },
                body,
            });
        } catch (err) {
            await this.updateOrchestrator(userId, environmentId, {
                status: ORCHESTRATOR_STATUS.FAILED,
                message: `Failed to contact orchestrator: ${(err as Error).message}`,
            });
            throw err;
        }

        return {
            message: MSG_TERMINATE_REQUESTED,
            status: ORCHESTRATOR_STATUS.TERMINATING,
        };
    }

    async applyOrchestratorCallback(
        environmentId: string,
        incomingSecret: string,
        status: string,
        details: Record<string, unknown>
    ): Promise<void> {
        const expectedSecret = this.envConfig.internalSecret;
        if (!expectedSecret || !EnvironmentsUtils.constantTimeCompare(incomingSecret, expectedSecret)) {
            throw new ForbiddenException('Invalid internal secret');
        }

        const env = await this.prisma.client.environment.findUnique({
            where: { id: environmentId },
        });
        if (!env) throw new NotFoundException('Environment not found');

        const config = EnvironmentsUtils.getConfig(env);
        const current = EnvironmentsUtils.getOrchestratorConfig(config);
        const nextStatus = this.normalizeOrchestratorStatus(status);
        const now = new Date();

        await this.prisma.client.environment.update({
            where: { id: environmentId },
            data: {
                orchestratorStatus: nextStatus,
                orchestratorStatusUpdatedAt: now,
                config: {
                    ...config,
                    orchestrator: {
                        ...current,
                        status: nextStatus,
                        message: EnvironmentsUtils.readString(details.message) ?? `Status updated to ${status}`,
                        ts: now.toISOString(),
                        details: { ...((current.details as Record<string, unknown>) ?? {}), ...details },
                    },
                } as unknown as Prisma.InputJsonValue,
            },
        });
    }

    async getEnvironmentStatus(
        userId: string,
        environmentId: string
    ): Promise<{
        environmentId: string;
        status: string;
        state?: string;
        instanceId?: string;
        privateIp?: string;
        ipv6Addresses?: string[];
        region?: string;
        lastUpdated: string;
    }> {
        const env = await this.crudService.findOne(userId, environmentId);
        const cfg = EnvironmentsUtils.getConfig(env);
        const orchestrator = EnvironmentsUtils.getOrchestratorConfig(cfg);

        const status = (orchestrator.status as string | undefined) ?? ORCHESTRATOR_STATUS.UNKNOWN;
        const details = (orchestrator.details as Record<string, unknown> | undefined) ?? {};

        return {
            environmentId,
            status,
            state: status,
            instanceId: EnvironmentsUtils.readString(details.instanceId) ?? undefined,
            privateIp: EnvironmentsUtils.readString(details.privateIp) ?? undefined,
            ipv6Addresses: Array.isArray(details.ipv6Addresses)
                ? details.ipv6Addresses.filter((v): v is string => typeof v === 'string')
                : undefined,
            region: env.region ?? undefined,
            lastUpdated:
                EnvironmentsUtils.readString(orchestrator.ts) ??
                EnvironmentsUtils.readString(orchestrator.updatedAt) ??
                new Date().toISOString(),
        };
    }

    async recordActivity(userId: string, environmentId: string): Promise<string> {
        await this.crudService.findOne(userId, environmentId);

        const now = new Date().toISOString();
        await this.prismaTx.runInTransaction(async (tx) => {
            const current = await tx.environment.findUnique({
                where: { id: environmentId },
                select: { config: true },
            });

            await tx.environment.update({
                where: { id: environmentId },
                data: {
                    config: {
                        ...((current?.config as Record<string, unknown>) ?? {}),
                        lastActivityAt: now,
                    },
                },
            });
        });

        return now;
    }

    async getLastActivityAt(environmentId: string): Promise<string | null> {
        const env = await this.prisma.client.environment.findUnique({
            where: { id: environmentId },
            select: { config: true, updatedAt: true, createdAt: true },
        });
        if (!env) return null;

        const cfg = EnvironmentsUtils.getConfig(env);
        const last = cfg.lastActivityAt;
        if (typeof last === 'string' && last.length > 0) return last;

        return (env.updatedAt || env.createdAt).toISOString();
    }

    private async updateOrchestrator(
        userId: string,
        environmentId: string,
        data: { status: OrchestratorStatus; message: string }
    ): Promise<void> {
        const env = await this.getOwnedEnvironmentOrThrow(userId, environmentId);
        const config = EnvironmentsUtils.getConfig(env);
        const current = EnvironmentsUtils.getOrchestratorConfig(config);
        const now = new Date();

        await this.prisma.client.environment.update({
            where: { id: environmentId },
            data: {
                orchestratorStatus: data.status,
                orchestratorStatusUpdatedAt: now,
                config: {
                    ...config,
                    orchestrator: {
                        ...current,
                        status: data.status,
                        message: data.message,
                        ts: now.toISOString(),
                    },
                },
            },
        });
    }

    private async getOwnedEnvironmentOrThrow(userId: string, environmentId: string): Promise<Environment> {
        const env = await this.prisma.client.environment.findUnique({ where: { id: environmentId } });
        if (!env) {
            throw new NotFoundException('Environment not found');
        }
        if (env.ownerId !== userId) {
            throw new ForbiddenException('Access denied to this environment');
        }
        return env as unknown as Environment;
    }

    private userStartLockResource(userId: string): string {
        return `env:lifecycle:user:${userId}:start`;
    }

    private normalizeOrchestratorStatus(status: string): OrchestratorStatus {
        const allowed = new Set<string>(Object.values(ORCHESTRATOR_STATUS));
        return allowed.has(status) ? (status as OrchestratorStatus) : ORCHESTRATOR_STATUS.UNKNOWN;
    }

    private async assertRunningEnvironmentsWithinPlan(
        userId: string,
        environmentId: string,
        currentEnvStatus: string
    ): Promise<void> {
        await this.billingAccess.assertNotHardLocked(userId);
        const limit = await this.billingAccess.getLimit(userId, 'environments_running', 1);

        const runningStatuses = [
            ORCHESTRATOR_STATUS.STARTING,
            ORCHESTRATOR_STATUS.READY,
            ORCHESTRATOR_STATUS.STOPPING,
        ];

        const alreadyRunning = new Set<string>(runningStatuses).has(currentEnvStatus);
        const delta = alreadyRunning ? 0 : 1;

        const where = {
            ownerId: userId,
            id: { not: environmentId },
            orchestratorStatus: { in: runningStatuses },
        };

        let current = await this.prisma.client.environment.count({ where });

        if (current + delta <= limit) return;

        await this.statusReconcile.reconcileStaleEnvironmentsForOwner(userId).catch(() => undefined);
        current = await this.prisma.client.environment.count({ where });

        if (current + delta <= limit) return;

        throw new ForbiddenException({
            code: 'PLAN_LIMIT_REACHED',
            detail: `Running environments limit reached (${current + delta}/${limit}). Stop an environment or upgrade your plan.`,
        });
    }

    listServerPresets(): ServerPreset[] {
        return [...SERVER_PRESETS];
    }

    async listConfiguredRegions(): Promise<{ region: string }[]> {
        const regions = await this.prisma.client.orchestratorRegionConfig.findMany({
            select: { region: true },
            orderBy: { region: 'asc' },
        });
        return regions.map((r) => ({ region: r.region }));
    }

    async listInstanceTypes(
        region: string,
        arch: 'x86_64' | 'arm64',
        q?: string,
        limit?: string
    ): Promise<{ instanceType: string; vcpu: number; memoryMiB: number }[]> {
        if (!region) throw new BadRequestException('region is required');
        if (arch !== EC2_ARCHITECTURE.X86_64 && arch !== EC2_ARCHITECTURE.ARM64)
            throw new BadRequestException('arch is invalid');

        const exists = await this.prisma.client.orchestratorRegionConfig.findUnique({
            where: { region },
            select: { region: true },
        });
        if (!exists) {
            throw new BadRequestException(`Region ${region} is not configured`);
        }

        const qs = new URLSearchParams();
        qs.set('region', region);
        qs.set('arch', arch);
        if (q) qs.set('q', q);
        if (limit) qs.set('limit', limit);

        const resp = await this.callOrchestrator('GET', `/internal/instance-types?${qs.toString()}`, {
            headers: { 'x-internal-secret': this.requireInternalSecret() },
        });

        const warming = (resp as OrchestratorInstanceTypesResponse)?.warming === true;
        if (warming) {
            throw new ServiceUnavailableException('Instance type catalog is warming; retry shortly');
        }

        const ok = resp?.ok === true;
        const items = (resp?.items as unknown) ?? null;
        if (!ok || !Array.isArray(items)) {
            throw new BadRequestException('Failed to fetch instance types from orchestrator');
        }

        return items.filter((it): it is { instanceType: string; vcpu: number; memoryMiB: number } => {
            const item = it as Record<string, unknown>;
            return (
                typeof item?.instanceType === 'string' &&
                typeof item?.vcpu === 'number' &&
                typeof item?.memoryMiB === 'number'
            );
        });
    }

    async getInstanceType(
        region: string,
        arch: 'x86_64' | 'arm64',
        instanceType: string
    ): Promise<{ instanceType: string; vcpu: number; memoryMiB: number }> {
        if (!region) throw new BadRequestException('region is required');
        if (arch !== EC2_ARCHITECTURE.X86_64 && arch !== EC2_ARCHITECTURE.ARM64)
            throw new BadRequestException('arch is invalid');
        if (!instanceType) throw new BadRequestException('instanceType is required');

        const exists = await this.prisma.client.orchestratorRegionConfig.findUnique({
            where: { region },
            select: { region: true },
        });
        if (!exists) {
            throw new BadRequestException(`Region ${region} is not configured`);
        }

        const qs = new URLSearchParams();
        qs.set('region', region);
        qs.set('arch', arch);
        qs.set('instanceType', instanceType);

        const resp = await this.callOrchestrator('GET', `/internal/instance-type?${qs.toString()}`, {
            headers: { 'x-internal-secret': this.requireInternalSecret() },
        });

        const typedResp = resp as OrchestratorInstanceTypeResponse;
        const ok = typedResp?.ok === true;
        const item = typedResp?.item;
        if (!ok || !item || typeof item !== 'object') {
            throw new BadRequestException('Failed to fetch instance type details from orchestrator');
        }

        const vcpu = Number(item.vcpu);
        const memoryMiB = Number(item.memoryMiB);
        const returnedType = EnvironmentsUtils.readString(item.instanceType);
        if (!returnedType || !Number.isFinite(vcpu) || !Number.isFinite(memoryMiB)) {
            throw new BadRequestException(`Invalid instance type metadata for ${instanceType}`);
        }

        return { instanceType: returnedType, vcpu, memoryMiB };
    }

    private requireInternalSecret(): string {
        const secret = this.envConfig.internalSecret;
        if (!secret) {
            throw new ServiceUnavailableException(
                'Orchestrator integration is not configured: INTERNAL_SECRET is missing'
            );
        }
        return secret;
    }

    private async callOrchestrator(
        method: 'GET' | 'POST',
        path: string,
        opts?: { headers?: Record<string, string>; body?: unknown }
    ): Promise<Record<string, unknown>> {
        if (path.startsWith('/internal/')) {
            this.requireInternalSecret();
        }

        const url = `${this.envConfig.orchestratorUrl}${path}`;

        const timeoutMs = this.envConfig.orchestratorTimeoutMs;
        const fetchInit: RequestInit = { method };
        const headers: Record<string, string> = { ...(opts?.headers ?? {}) };
        if (opts?.body !== undefined) {
            headers['Content-Type'] = 'application/json';
            fetchInit.body = JSON.stringify(opts.body);
        }
        if (Object.keys(headers).length > 0) fetchInit.headers = headers;

        return this.orchestratorBreaker.exec(async () => {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), timeoutMs);
            try {
                if (process.env.NODE_ENV !== 'production') {
                    console.log('[callOrchestrator] →', method, url, `(timeout ${timeoutMs}ms)`);
                }

                const res = await fetch(url, { ...fetchInit, signal: controller.signal });

                if (process.env.NODE_ENV !== 'production') {
                    console.log('[callOrchestrator] ← status:', res.status);
                    console.log('[callOrchestrator] ← headers:', Object.fromEntries(res.headers.entries()));
                }

                if (!res.ok) {
                    const body = await res.text().catch(() => '');
                    throw new Error(`Orchestrator ${method} ${path} failed with ${res.status}: ${body}`);
                }
                return res.json() as Promise<Record<string, unknown>>;
            } catch (err) {
                const e = err as Error & { cause?: { code?: string; errors?: Array<{ code?: string }> } };
                const isAbort = e?.name === 'AbortError';
                const isConnRefused =
                    e?.cause?.code === 'ECONNREFUSED' ||
                    (Array.isArray(e?.cause?.errors) && e.cause.errors.some((x) => x?.code === 'ECONNREFUSED'));

                if (isAbort) {
                    throw new ServiceUnavailableException(
                        `Orchestrator ${method} ${path} timeout after ${timeoutMs}ms`
                    );
                }
                if (isConnRefused) {
                    throw new ServiceUnavailableException(`Orchestrator is unavailable (${method} ${path})`);
                }
                throw err;
            } finally {
                clearTimeout(timeout);
            }
        });
    }

    private async buildOrchestratorStartRequest(
        userId: string,
        env: Environment
    ): Promise<OrchestratorStartRequest> {
        const cfg = EnvironmentsUtils.getConfig(env);
        const region = (env.region || ENVIRONMENT_REGION.US_EAST_1) as string;
        const instanceName = await this.buildEc2InstanceNameTag(userId, env);

        const regionCfg = await this.prisma.client.orchestratorRegionConfig.findUnique({
            where: { region },
        });
        if (!regionCfg) {
            throw new BadRequestException(
                `Missing orchestrator region config for ${region}. Create a row in OrchestratorRegionConfig via Prisma Studio.`
            );
        }
        if (!Array.isArray(regionCfg.subnetIds) || regionCfg.subnetIds.length === 0) {
            throw new BadRequestException(`Region config for ${region} has no subnetIds`);
        }
        if (!Array.isArray(regionCfg.securityGroupIds) || regionCfg.securityGroupIds.length === 0) {
            throw new BadRequestException(`Region config for ${region} has no securityGroupIds`);
        }

        const subnetId = regionCfg.subnetIds[EnvironmentsUtils.hashIndex(env.id, regionCfg.subnetIds.length)];
        if (!subnetId) {
            throw new BadRequestException(`Region config for ${region} did not yield a valid subnetId`);
        }

        const architecture: (typeof EC2_ARCHITECTURE)[keyof typeof EC2_ARCHITECTURE] =
            cfg.architecture === EC2_ARCHITECTURE.ARM64 ? EC2_ARCHITECTURE.ARM64 : EC2_ARCHITECTURE.X86_64;

        const marketType: (typeof MARKET_TYPE)[keyof typeof MARKET_TYPE] =
            cfg.marketType === MARKET_TYPE.SPOT || cfg.instanceType === MARKET_TYPE.SPOT
                ? MARKET_TYPE.SPOT
                : MARKET_TYPE.ON_DEMAND;

        const configMode =
            cfg.configMode === CONFIG_MODE.CUSTOM ? CONFIG_MODE.CUSTOM : CONFIG_MODE.PRESET;
        const { compute, rootVolume } = this.computeFromConfig(cfg, configMode);

        const requestedInstanceType =
            configMode === CONFIG_MODE.PRESET
                ? compute.instanceType
                : (EnvironmentsUtils.readString(cfg.ec2InstanceType) ?? null);

        const effectiveMode: (typeof CONFIG_MODE)[keyof typeof CONFIG_MODE] =
            requestedInstanceType ? CONFIG_MODE.PRESET : configMode;

        const computeForLimits = requestedInstanceType
            ? await this.fetchInstanceTypeDetails(region, architecture, requestedInstanceType)
            : compute;

        await this.enforceResourceLimits(userId, {
            vcpu: computeForLimits.vcpu,
            ramGb: Math.ceil(computeForLimits.memoryMiB / 1024),
            diskGiB: rootVolume.sizeGiB,
            marketType,
        });

        const amiId =
            architecture === EC2_ARCHITECTURE.ARM64 ? regionCfg.amiIdArm64 : regionCfg.amiIdX86_64;

        return {
            envId: env.id,
            instanceName,
            region,
            architecture,
            marketType,
            mode: effectiveMode,
            ...(effectiveMode === CONFIG_MODE.PRESET
                ? { preset: { instanceType: requestedInstanceType ?? compute.instanceType } }
                : { custom: { vcpu: compute.vcpu, memoryMiB: compute.memoryMiB } }),
            rootVolume,
            infra: {
                subnetId,
                securityGroupIds: regionCfg.securityGroupIds,
                amiId,
                instanceProfileName: regionCfg.instanceProfileName,
                userDataBase64: regionCfg.userDataBase64 ?? null,
                dynamodbTable: regionCfg.dynamodbTable,
                envDomainSuffix: regionCfg.envDomainSuffix,
            },
        };
    }

    private async buildEc2InstanceNameTag(userId: string, env: Environment): Promise<string> {
        const user = await this.prisma.client.user.findUnique({
            where: { id: userId },
            select: { username: true, firstName: true, lastName: true },
        });

        const ownerLabel =
            user?.username ||
            [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
            userId.slice(0, 8);

        const envLabel = (env.displayName || 'env').trim();

        const raw = `${ownerLabel}-${envLabel}-${env.id.slice(0, 8)}`;
        const cleaned = raw
            .normalize('NFKD')
            .replace(/[^\w\s.-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .slice(0, 255);

        return cleaned || `env-${env.id}`;
    }

    private async buildOrchestratorBasicRequest(env: Environment): Promise<OrchestratorBasicRequest> {
        const region = (env.region || ENVIRONMENT_REGION.US_EAST_1) as string;
        const regionCfg = await this.prisma.client.orchestratorRegionConfig.findUnique({
            where: { region },
        });
        if (!regionCfg) {
            throw new BadRequestException(
                `Missing orchestrator region config for ${region}. Create a row in OrchestratorRegionConfig via Prisma Studio.`
            );
        }
        return {
            envId: env.id,
            region,
            infra: {
                dynamodbTable: regionCfg.dynamodbTable,
                envDomainSuffix: regionCfg.envDomainSuffix,
            },
        };
    }

    private computeFromConfig(
        cfg: Record<string, unknown>,
        mode: 'preset' | 'custom'
    ): {
        compute:
        | { instanceType: string; vcpu: number; memoryMiB: number }
        | { vcpu: number; memoryMiB: number; instanceType: string };
        rootVolume: { sizeGiB: number; type: (typeof ROOT_VOLUME_TYPE)[keyof typeof ROOT_VOLUME_TYPE] };
    } {
        const defaultDisk = DEFAULT_DISK_GIB;

        const rootVolumeCfg = cfg.rootVolume as
            | { sizeGiB?: unknown; type?: unknown }
            | undefined;
        const rootSizeGiBRaw = Number(rootVolumeCfg?.sizeGiB);
        const rootTypeRaw = EnvironmentsUtils.readString(rootVolumeCfg?.type) ?? null;
        const rootType =
            rootTypeRaw === ROOT_VOLUME_TYPE.GP3 ||
                rootTypeRaw === ROOT_VOLUME_TYPE.ST1 ||
                rootTypeRaw === ROOT_VOLUME_TYPE.SC1
                ? rootTypeRaw
                : null;

        const custom = cfg.custom as EnvironmentConfigCustom | undefined;
        const storage = custom?.storage;
        const sizeGiB =
            Number.isFinite(rootSizeGiBRaw) && rootSizeGiBRaw > 0
                ? Math.round(rootSizeGiBRaw)
                : typeof storage?.size === 'number' && storage.size > 0
                    ? Math.round(storage.size * (storage.unit === 'TB' ? 1024 : 1))
                    : EnvironmentsUtils.parsePresetDiskGiB((cfg.serverPreset as EnvironmentConfigServerPreset)?.storage) ??
                    defaultDisk;
        const volumeType: (typeof ROOT_VOLUME_TYPE)[keyof typeof ROOT_VOLUME_TYPE] =
            rootType ?? (storage?.type === 'HDD' ? ROOT_VOLUME_TYPE.ST1 : ROOT_VOLUME_TYPE.GP3);

        if (mode === CONFIG_MODE.PRESET) {
            const instanceType =
                EnvironmentsUtils.readString((cfg.serverPreset as EnvironmentConfigServerPreset)?.instanceType) ??
                EnvironmentsUtils.instanceTypeFromPresetId(EnvironmentsUtils.readString(cfg.serverPresetId) ?? '') ??
                't3.small';
            const { vcpu, memoryMiB } = EnvironmentsUtils.presetResources(instanceType);
            return { compute: { instanceType, vcpu, memoryMiB }, rootVolume: { sizeGiB, type: volumeType } };
        }

        const cpuCores = Number(custom?.cpuCores ?? 2);
        const mem = custom?.memory;
        const memoryMiB = Math.round(
            (Number(mem?.size ?? 4) || 4) * (mem?.unit === 'TB' ? 1024 * 1024 : 1024)
        );
        const vcpu = Math.max(1, Math.floor(cpuCores || 2));
        return { compute: { vcpu, memoryMiB, instanceType: 'auto' }, rootVolume: { sizeGiB, type: volumeType } };
    }

    private async fetchInstanceTypeDetails(
        region: string,
        arch: 'x86_64' | 'arm64',
        instanceType: string
    ): Promise<{ instanceType: string; vcpu: number; memoryMiB: number }> {
        return this.getInstanceType(region, arch, instanceType);
    }

    private async enforceResourceLimits(
        userId: string,
        req: { vcpu: number; ramGb: number; diskGiB: number; marketType: (typeof MARKET_TYPE)[keyof typeof MARKET_TYPE] }
    ): Promise<void> {
        await this.billingAccess.assertNotHardLocked(userId);

        const maxVcpu = await this.billingAccess.getLimit(userId, 'env_max_vcpu', 2);
        const maxRamGb = await this.billingAccess.getLimit(userId, 'env_max_ram_gb', 4);
        const maxDisk = await this.billingAccess.getLimit(userId, 'env_max_disk_gb', 80);
        const allowSpot = (await this.billingAccess.getLimit(userId, 'env_allow_spot', 0)) > 0;

        if (req.marketType === MARKET_TYPE.SPOT && !allowSpot) {
            throw new ForbiddenException('Your plan does not allow spot instances');
        }
        if (req.vcpu > maxVcpu) {
            throw new ForbiddenException(`Requested vCPU (${req.vcpu}) exceeds plan limit (${maxVcpu})`);
        }
        if (req.ramGb > maxRamGb) {
            throw new ForbiddenException(
                `Requested RAM (${req.ramGb} GB) exceeds plan limit (${maxRamGb} GB)`
            );
        }
        if (req.diskGiB > maxDisk) {
            throw new ForbiddenException(
                `Requested disk (${req.diskGiB} GB) exceeds plan limit (${maxDisk} GB)`
            );
        }
    }

    private lifecycleLockResource(environmentId: string): string {
        return `lock:environment:lifecycle:${environmentId}`;
    }
}
