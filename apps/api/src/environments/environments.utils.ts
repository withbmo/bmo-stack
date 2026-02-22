import { createHash, timingSafeEqual } from 'crypto';
import type { Environment as PrismaEnvironment } from '@pytholit/db';
import type { Environment, TierPolicy, ExecutionMode, EnvironmentVisibility } from '@pytholit/contracts';
import { SERVER_PRESETS } from '@pytholit/contracts';
import { getDefaultPlan, getPlanById } from '@pytholit/config';
import type { Plan } from '@pytholit/config';

export function hashIndex(key: string, mod: number): number {
    const sum = key.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return mod <= 0 ? 0 : sum % mod;
}

export function instanceTypeFromPresetId(presetId: string): string | null {
    const preset = SERVER_PRESETS.find((p) => p.id === presetId);
    return preset?.instanceType ?? null;
}

export function parsePresetDiskGiB(storage: unknown): number | null {
    const str = readString(storage);
    if (!str) return null;
    const match = str.match(/(\d+)\s*GB/i);
    if (!match) return null;
    const parsed = Number(match[1]);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function presetResources(_instanceType: string): { vcpu: number; memoryMiB: number } {
    return { vcpu: 2, memoryMiB: 4 * 1024 };
}

export function sha256(value: string): string {
    return createHash('sha256').update(value).digest('hex');
}

export function getConfig(env: { config?: unknown }): Record<string, unknown> {
    return (env.config as Record<string, unknown>) ?? {};
}

export function getOrchestratorConfig(config: Record<string, unknown>): Record<string, unknown> {
    return (config.orchestrator as Record<string, unknown>) ?? {};
}

export function getAccessConfig(config: Record<string, unknown>): Record<string, unknown> {
    return (config.access as Record<string, unknown>) ?? {};
}

export function constantTimeCompare(a: string, b: string): boolean {
    const bufA = Buffer.from(a, 'utf8');
    const bufB = Buffer.from(b, 'utf8');
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
}

export function readString(input: unknown): string | null {
    return typeof input === 'string' && input.length > 0 ? input : null;
}

export function formatEnvironment(env: PrismaEnvironment): Environment {
    return {
        id: env.id,
        ownerId: env.ownerId,
        envType: env.envType,
        displayName: env.displayName,
        tierPolicy: env.tierPolicy as TierPolicy | null,
        executionMode: env.executionMode as ExecutionMode,
        region: env.region,
        visibility: env.visibility as EnvironmentVisibility,
        config: env.config,
        createdAt: env.createdAt.toISOString(),
        updatedAt: env.updatedAt.toISOString(),
    };
}

export async function resolveUserPlan(userId: string, prisma: any): Promise<Plan> {
        const subscription = await prisma.client.subscription.findFirst({
            where: {
                userId,
                status: { in: ['active', 'trialing', 'past_due'] },
            },
            orderBy: { createdAt: 'desc' },
        });

        return subscription?.planId ? getPlanById(subscription.planId) ?? getDefaultPlan() : getDefaultPlan();
    }

    export function featureNumberOrUnlimited(
        plan: ReturnType<typeof getDefaultPlan>,
        id: string,
        fallback: number
    ): number | 'unlimited' {
        const value = plan.features.find((f: any) => f.id === id)?.value;
        if (value === 'unlimited') return 'unlimited';
        if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value;
        return fallback;
    }

    export function featureBool(
        plan: ReturnType<typeof getDefaultPlan>,
        id: string,
        fallback: boolean
    ): boolean {
        const value = plan.features.find((f: any) => f.id === id)?.value;
        if (typeof value === 'boolean') return value;
        return fallback;
    }
