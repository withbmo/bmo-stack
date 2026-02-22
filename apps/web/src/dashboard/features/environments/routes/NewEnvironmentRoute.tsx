'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CONFIG_MODE, EC2_ARCHITECTURE, MARKET_TYPE, ROOT_VOLUME_TYPE } from '@pytholit/contracts';
import { ArrowLeft, Info, Layers, Plus, Settings, Trash2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button, DashboardTabs, Input } from '@/dashboard/components';
import { useAuth } from '@/shared/auth';
import { DashboardPageHeader, PageLayout } from '@/shared/components/layout';
import type { EnvironmentConfig } from '@/shared/contracts/environment-config';
import { getApiErrorMessage } from '@/shared/lib';
import {
  createEnvironment,
  fetchEnvironmentRegions,
  fetchInstanceTypes,
  fetchServerPresets,
} from '@/shared/lib/environments';
import { queryKeys } from '@/shared/lib/query-keys';
import type { EnvironmentEnvType, EnvironmentVisibility, ExecutionMode } from '@/shared/types';

import { useProjects } from '../../projects/hooks/useProjects';

type EnvVar = {
  key: string;
  value: string;
};

const InstanceTypePicker = ({
  region,
  arch,
  query,
  value,
  onChange,
}: {
  region: string;
  arch: (typeof EC2_ARCHITECTURE)[keyof typeof EC2_ARCHITECTURE];
  query: string;
  value: string;
  onChange: (next: string) => void;
}) => {
  const q = query.trim();
  const enabled =
    region.length > 0 &&
    (arch === EC2_ARCHITECTURE.X86_64 || arch === EC2_ARCHITECTURE.ARM64) &&
    q.length >= 2;

  const curated: { instanceType: string; vcpu: number; memoryMiB: number }[] =
    arch === EC2_ARCHITECTURE.ARM64
      ? [
          { instanceType: 't4g.small', vcpu: 2, memoryMiB: 2048 },
          { instanceType: 't4g.medium', vcpu: 2, memoryMiB: 4096 },
          { instanceType: 'm7g.large', vcpu: 2, memoryMiB: 8192 },
          { instanceType: 'c7g.large', vcpu: 2, memoryMiB: 4096 },
        ]
      : [
          { instanceType: 't3.small', vcpu: 2, memoryMiB: 2048 },
          { instanceType: 't3.medium', vcpu: 2, memoryMiB: 4096 },
          { instanceType: 't3.large', vcpu: 2, memoryMiB: 8192 },
          { instanceType: 'm6i.large', vcpu: 2, memoryMiB: 8192 },
          { instanceType: 'c6i.large', vcpu: 2, memoryMiB: 4096 },
        ];

  const typesQ = useQuery({
    queryKey: ['environments', 'instance-types', region, arch, q],
    queryFn: () => fetchInstanceTypes(undefined, { region, arch, q, limit: 200 }),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, err: any) => {
      // 503 means orchestrator cache is warming or temporarily unavailable; keep retrying briefly.
      if (err && typeof err === 'object' && (err as any).status === 503) return failureCount < 30;
      return false;
    },
    retryDelay: attemptIndex => Math.min(1500, 500 + attemptIndex * 100),
  });

  const items = q.length >= 2 ? (typesQ.data ?? []) : curated;
  const errStatus = (typesQ.error as any)?.status as number | undefined;
  const errDetail = (typesQ.error as any)?.detail as string | undefined;
  const warming =
    typesQ.isError &&
    errStatus === 503 &&
    typeof errDetail === 'string' &&
    errDetail.toLowerCase().includes('warming');

  return (
    <div className="space-y-2">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-bg-surface border border-border-dim p-3 font-mono text-sm text-text-primary focus:border-border-highlight outline-none"
        disabled={region.length === 0 || typesQ.isLoading}
      >
        <option value="">
          {typesQ.isLoading
            ? 'Loading instance types…'
            : warming
              ? 'Warming instance catalog…'
              : q.length >= 2
                ? 'Choose an instance type…'
                : 'Choose an instance type (or search)…'}
        </option>
        {items.map(it => (
          <option key={it.instanceType} value={it.instanceType}>
            {it.instanceType} · {it.vcpu} vCPU · {Math.ceil(it.memoryMiB / 1024)} GB
          </option>
        ))}
      </select>
      {typesQ.isError && q.length >= 2 ? (
        warming ? (
          <div className="text-[10px] font-mono text-yellow-300">
            Warming instance catalog… retrying.
          </div>
        ) : (
          <div className="text-[10px] font-mono text-red-400">
            {getApiErrorMessage(typesQ.error, 'Failed to load instance types.')}
          </div>
        )
      ) : null}
      <div className="text-[10px] font-mono text-nexus-muted">
        {q.length >= 2
          ? `Showing up to 200 results for "${q}".`
          : 'Showing curated defaults. Type 2+ characters to search AWS.'}
      </div>
    </div>
  );
};

export const NewEnvironmentRoute = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { user, hydrated } = useAuth();
  const { data: projects = [] } = useProjects();
  const { data: serverPresets = [] } = useQuery({
    queryKey: ['environments', 'presets'],
    queryFn: () => fetchServerPresets(),
    staleTime: 5 * 60 * 1000,
  });
  const { data: configuredRegions = [] } = useQuery({
    queryKey: ['environments', 'regions'],
    queryFn: () => fetchEnvironmentRegions(),
    staleTime: 5 * 60 * 1000,
  });
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');
  const [envType, setEnvType] = useState<EnvironmentEnvType>('dev');
  const [displayName, setDisplayName] = useState('');
  const [executionMode, setExecutionMode] = useState<ExecutionMode>('managed');
  const [visibility, setVisibility] = useState<EnvironmentVisibility>('private');
  const [instanceType, setInstanceType] = useState<
    (typeof MARKET_TYPE)[keyof typeof MARKET_TYPE]
  >(MARKET_TYPE.ON_DEMAND);
  const [configMode, setConfigMode] = useState<
    (typeof CONFIG_MODE)[keyof typeof CONFIG_MODE]
  >(CONFIG_MODE.PRESET);
  const [architecture, setArchitecture] = useState<
    (typeof EC2_ARCHITECTURE)[keyof typeof EC2_ARCHITECTURE]
  >(EC2_ARCHITECTURE.X86_64);
  const [ec2InstanceType, setEc2InstanceType] = useState('');
  const [instanceTypeQuery, setInstanceTypeQuery] = useState('');

  // Preset mode
  const [serverId, setServerId] = useState('');

  // Custom mode
  const [customStorageSize, setCustomStorageSize] = useState(80);
  const [customStorageUnit, setCustomStorageUnit] = useState<'GB' | 'TB'>('GB');
  const [customStorageType, setCustomStorageType] = useState<'SSD' | 'HDD'>('SSD');
  const [customNetworkSpeed, setCustomNetworkSpeed] = useState(1);
  const [customNetworkUnit, setCustomNetworkUnit] = useState<'Gbps' | 'Mbps'>('Gbps');
  const [customRegion, setCustomRegion] = useState('us-east-1');
  const [customZone, setCustomZone] = useState('us-east-1a');

  const [envVars, setEnvVars] = useState<EnvVar[]>([{ key: '', value: '' }]);

  useEffect(() => {
    // Keep URL param supported for future (e.g. redirect back after creation),
    // but environments are no longer created per-project.
    void searchParams?.toString();
    void projects;
  }, [projects, searchParams]);

  // Production environments are always public
  useEffect(() => {
    if (envType === 'prod') setVisibility('public');
  }, [envType]);

  // Keep custom region valid when configured regions list loads/changes
  useEffect(() => {
    if (configMode !== CONFIG_MODE.CUSTOM) return;
    if (configuredRegions.length === 0) return;
    const ok = configuredRegions.some(r => r.region === customRegion);
    if (!ok) setCustomRegion(configuredRegions[0]!.region);
  }, [configMode, configuredRegions, customRegion]);

  const selectedServer = useMemo(
    () => serverPresets.find(s => s.id === serverId) || null,
    [serverId, serverPresets]
  );

  // Region and zone: from preset or custom
  const region =
    configMode === CONFIG_MODE.PRESET ? selectedServer?.region || 'us-east-1' : customRegion;
  const zone =
    configMode === CONFIG_MODE.PRESET
      ? selectedServer?.region
        ? `${selectedServer.region}a`
        : 'us-east-1a'
      : customZone;

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!hydrated || !user) throw new Error('Not authenticated');
      if (!displayName.trim()) {
        throw new Error('Display name is required');
      }
      if (configMode === CONFIG_MODE.PRESET && !serverId) {
        throw new Error('Please choose a server preset');
      }
      if (configMode === CONFIG_MODE.CUSTOM && !ec2InstanceType.trim()) {
        throw new Error('Please choose an EC2 instance type');
      }

      const normalizedEnvVars = envVars
        .map(v => ({ key: v.key.trim(), value: v.value }))
        .filter(v => v.key.length > 0);

      const rootSizeGiB = Math.round(customStorageSize * (customStorageUnit === 'TB' ? 1024 : 1));
      const rootType =
        customStorageType === 'HDD' ? ROOT_VOLUME_TYPE.ST1 : ROOT_VOLUME_TYPE.GP3;

      return createEnvironment(undefined, {
        envType,
        displayName: displayName.trim(),
        executionMode: executionMode,
        visibility,
        region: region ? region : null,
        environmentClass: envType,
        config: {
          schema_version: 1,
          instanceType,
          marketType: instanceType,
          configMode,
          zone,
          serverPresetId: configMode === CONFIG_MODE.PRESET ? serverId : null,
          serverPreset: configMode === CONFIG_MODE.PRESET ? selectedServer : null,
          architecture:
            configMode === CONFIG_MODE.CUSTOM ? architecture : EC2_ARCHITECTURE.X86_64,
          ec2InstanceType: configMode === CONFIG_MODE.CUSTOM ? ec2InstanceType.trim() : null,
          rootVolume: { sizeGiB: rootSizeGiB, type: rootType },
          custom:
            configMode === CONFIG_MODE.CUSTOM
              ? {
                  storage: {
                    size: customStorageSize,
                    unit: customStorageUnit,
                    type: customStorageType,
                  },
                  network: {
                    speed: customNetworkSpeed,
                    unit: customNetworkUnit,
                  },
                }
              : null,
          envVars: normalizedEnvVars,
        } as EnvironmentConfig,
      });
    },
    onSuccess: () => {
      toast.success('Environment created');
      // Ensure environments list is fresh when we redirect back
      queryClient.invalidateQueries({ queryKey: queryKeys.environments() });
      router.push(`/dashboard/environments`);
    },
  });

  return (
    <PageLayout className="pb-12">
      <DashboardPageHeader
        badge={{ icon: Layers, label: 'NEW ENVIRONMENT' }}
        title={
          <>
            <span className="text-nexus-muted">CREATE</span> ENVIRONMENT
          </>
        }
        subtitle="Create a new environment for a project."
        actions={
          <button
            onClick={() => router.push('/dashboard/environments')}
            className="text-xs font-mono text-nexus-muted hover:text-white flex items-center gap-2 transition-colors group"
          >
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={14} />
            BACK TO ENVIRONMENTS
          </button>
        }
      />

      {/* Tabs */}
      <DashboardTabs
        tabs={[
          { value: 'basic', label: 'Basic Info', icon: Info },
          { value: 'advanced', label: 'Advanced', icon: Settings },
        ]}
        active={activeTab}
        onChange={value => setActiveTab(value as 'basic' | 'advanced')}
        size="large"
        className="mb-6"
      />

      {/* Tab Content */}
      <div className="bg-bg-panel border border-nexus-gray p-6">
        {activeTab === 'basic' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <label className="block text-xs font-mono text-nexus-purple uppercase tracking-wider mb-2">
                Env Type *
              </label>
              <select
                value={envType}
                onChange={e => setEnvType(e.target.value as EnvironmentEnvType)}
                className="w-full bg-bg-surface border border-border-dim p-3 font-mono text-sm text-text-primary focus:border-border-highlight focus:ring-1 focus:ring-border-highlight outline-none"
              >
                <option value="dev">Development (dev)</option>
                <option value="prod">Production (prod)</option>
              </select>
              <p className="mt-1 text-[10px] font-mono text-nexus-muted">
                You can create multiple environments per type; display name must be unique.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono text-nexus-purple uppercase tracking-wider mb-2">
                Display Name *
              </label>
              <Input
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="My Dev Environment"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-nexus-purple uppercase tracking-wider mb-2">
                  Execution Mode *
                </label>
                <select
                  value={executionMode}
                  onChange={e => setExecutionMode(e.target.value as ExecutionMode)}
                  className="w-full bg-bg-surface border border-border-dim p-3 font-mono text-sm text-text-primary focus:border-border-highlight focus:ring-1 focus:ring-border-highlight outline-none"
                >
                  <option value="managed">Managed</option>
                  <option value="byo_aws">BYO AWS</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-nexus-purple uppercase tracking-wider mb-2">
                  Visibility *
                </label>
                <select
                  value={visibility}
                  onChange={e => setVisibility(e.target.value as EnvironmentVisibility)}
                  disabled={envType === 'prod'}
                  className="w-full bg-bg-surface border border-border-dim p-3 font-mono text-sm text-text-primary focus:border-border-highlight focus:ring-1 focus:ring-border-highlight outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {envType === 'dev' && <option value="private">Private</option>}
                  <option value="public">Public</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-nexus-purple uppercase tracking-wider mb-3">
                Instance Type *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setInstanceType(MARKET_TYPE.ON_DEMAND)}
                  className={`p-4 border-2 transition-all ${
                    instanceType === MARKET_TYPE.ON_DEMAND
                      ? 'border-nexus-accent bg-nexus-accent/10'
                      : 'border-nexus-gray bg-bg-surface hover:border-nexus-light'
                  }`}
                >
                  <div
                    className={`font-mono text-sm font-bold mb-1 ${
                      instanceType === MARKET_TYPE.ON_DEMAND ? 'text-white' : 'text-nexus-muted'
                    }`}
                  >
                    ON-DEMAND
                  </div>
                  <div className="text-[10px] text-nexus-muted">
                    Guaranteed availability, higher cost
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setInstanceType(MARKET_TYPE.SPOT)}
                  className={`p-4 border-2 transition-all ${
                    instanceType === 'spot'
                      ? 'border-nexus-accent bg-nexus-accent/10'
                      : 'border-nexus-gray bg-bg-surface hover:border-nexus-light'
                  }`}
                >
                  <div
                    className={`font-mono text-sm font-bold mb-1 ${
                      instanceType === MARKET_TYPE.SPOT ? 'text-white' : 'text-nexus-muted'
                    }`}
                  >
                    SPOT
                  </div>
                  <div className="text-[10px] text-nexus-muted">
                    Up to 90% cheaper, may be interrupted
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-nexus-purple uppercase tracking-wider mb-3">
                Configuration Mode *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setConfigMode(CONFIG_MODE.PRESET)}
                  className={`p-4 border-2 transition-all ${
                    configMode === CONFIG_MODE.PRESET
                      ? 'border-nexus-purple bg-nexus-purple/10'
                      : 'border-nexus-gray bg-bg-surface hover:border-nexus-light'
                  }`}
                >
                  <div
                    className={`font-mono text-sm font-bold mb-1 ${
                      configMode === CONFIG_MODE.PRESET ? 'text-white' : 'text-nexus-muted'
                    }`}
                  >
                    USE PRESET
                  </div>
                  <div className="text-[10px] text-nexus-muted">
                    Quick start with pre-configured resources
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setConfigMode(CONFIG_MODE.CUSTOM)}
                  className={`p-4 border-2 transition-all ${
                    configMode === CONFIG_MODE.CUSTOM
                      ? 'border-nexus-purple bg-nexus-purple/10'
                      : 'border-nexus-gray bg-bg-surface hover:border-nexus-light'
                  }`}
                >
                  <div
                    className={`font-mono text-sm font-bold mb-1 ${
                      configMode === CONFIG_MODE.CUSTOM ? 'text-white' : 'text-nexus-muted'
                    }`}
                  >
                    CUSTOM
                  </div>
                  <div className="text-[10px] text-nexus-muted">Configure your own specs</div>
                </button>
              </div>
            </div>

            {configMode === CONFIG_MODE.PRESET ? (
              <div>
                <label className="block text-xs font-mono text-nexus-purple uppercase tracking-wider mb-2">
                  Server Preset *
                </label>
                <select
                  value={serverId}
                  onChange={e => setServerId(e.target.value)}
                  className="w-full bg-bg-surface border border-border-dim p-3 font-mono text-sm text-text-primary focus:border-border-highlight focus:ring-1 focus:ring-border-highlight outline-none"
                >
                  <option value="">Choose a server preset...</option>
                  {serverPresets.map(server => (
                    <option key={server.id} value={server.id}>
                      {server.instanceType} · {server.region} · {server.cpu} · {server.memory} ·{' '}
                      {server.storage}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] font-mono text-nexus-muted">
                  Pre-configured compute resources for your environment
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-nexus-purple uppercase tracking-wider mb-2">
                    Architecture *
                  </label>
                  <select
                    value={architecture}
                    onChange={e =>
                      setArchitecture(
                        e.target.value as (typeof EC2_ARCHITECTURE)[keyof typeof EC2_ARCHITECTURE]
                      )
                    }
                    className="w-full bg-bg-surface border border-border-dim p-3 font-mono text-sm text-text-primary focus:border-border-highlight outline-none"
                  >
                    <option value="x86_64">x86_64</option>
                    <option value="arm64">arm64</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-nexus-purple uppercase tracking-wider mb-2">
                    EC2 Instance Type *
                  </label>
                  <Input
                    value={instanceTypeQuery}
                    onChange={e => setInstanceTypeQuery(e.target.value)}
                    placeholder="Search (e.g. t3, m6i, c7g)"
                  />
                  <div className="mt-2">
                    <InstanceTypePicker
                      region={region}
                      arch={architecture}
                      query={instanceTypeQuery}
                      value={ec2InstanceType}
                      onChange={setEc2InstanceType}
                    />
                  </div>
                </div>

                {/* Storage */}
                <div>
                  <label className="block text-xs font-mono text-nexus-purple uppercase tracking-wider mb-2">
                    Storage *
                  </label>
                  <div className="grid grid-cols-[1fr_auto_auto] gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={10000}
                      value={customStorageSize}
                      onChange={e => setCustomStorageSize(Number(e.target.value))}
                    />
                    <select
                      value={customStorageUnit}
                      onChange={e => setCustomStorageUnit(e.target.value as 'GB' | 'TB')}
                      className="bg-bg-surface border border-border-dim px-3 py-2 font-mono text-sm text-text-primary focus:border-border-highlight outline-none"
                    >
                      <option value="GB">GB</option>
                      <option value="TB">TB</option>
                    </select>
                    <select
                      value={customStorageType}
                      onChange={e => setCustomStorageType(e.target.value as 'SSD' | 'HDD')}
                      className="bg-bg-surface border border-border-dim px-3 py-2 font-mono text-sm text-text-primary focus:border-border-highlight outline-none"
                    >
                      <option value="SSD">SSD</option>
                      <option value="HDD">HDD</option>
                    </select>
                  </div>
                </div>

                {/* Network */}
                <div>
                  <label className="block text-xs font-mono text-nexus-purple uppercase tracking-wider mb-2">
                    Network Speed *
                  </label>
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      value={customNetworkSpeed}
                      onChange={e => setCustomNetworkSpeed(Number(e.target.value))}
                    />
                    <select
                      value={customNetworkUnit}
                      onChange={e => setCustomNetworkUnit(e.target.value as 'Gbps' | 'Mbps')}
                      className="bg-bg-surface border border-border-dim px-3 py-2 font-mono text-sm text-text-primary focus:border-border-highlight outline-none"
                    >
                      <option value="Mbps">Mbps</option>
                      <option value="Gbps">Gbps</option>
                    </select>
                  </div>
                </div>

                <p className="text-[10px] font-mono text-nexus-muted">
                  Choose the exact EC2 instance type to launch (AWS-backed).
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-nexus-purple uppercase tracking-wider mb-2">
                  Region {configMode === CONFIG_MODE.PRESET && selectedServer && '(Auto-selected)'}
                </label>
                {configMode === CONFIG_MODE.PRESET ? (
                  <Input
                    value={region.toUpperCase()}
                    disabled
                    className="bg-nexus-gray/10 cursor-not-allowed opacity-60"
                  />
                ) : (
                  <select
                    value={customRegion}
                    onChange={e => setCustomRegion(e.target.value)}
                    className="w-full bg-bg-surface border border-border-dim p-3 font-mono text-sm text-text-primary focus:border-border-highlight focus:ring-1 focus:ring-border-highlight outline-none"
                  >
                    {configuredRegions.length === 0 ? (
                      <option value="us-east-1">No configured regions</option>
                    ) : (
                      configuredRegions.map(r => (
                        <option key={r.region} value={r.region}>
                          {r.region}
                        </option>
                      ))
                    )}
                  </select>
                )}
                <p className="mt-1 text-[10px] font-mono text-nexus-muted">
                  {configMode === CONFIG_MODE.PRESET && selectedServer
                    ? 'Determined by your selected server preset'
                    : 'Geographic location of your infrastructure'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono text-nexus-purple uppercase tracking-wider mb-2">
                  Availability Zone {configMode === CONFIG_MODE.PRESET && selectedServer && '(Auto-selected)'}
                </label>
                {configMode === CONFIG_MODE.PRESET ? (
                  <Input
                    value={zone}
                    disabled
                    className="bg-nexus-gray/10 cursor-not-allowed opacity-60"
                  />
                ) : (
                  <select
                    value={customZone}
                    onChange={e => setCustomZone(e.target.value)}
                    className="w-full bg-bg-surface border border-border-dim p-3 font-mono text-sm text-text-primary focus:border-border-highlight focus:ring-1 focus:ring-border-highlight outline-none"
                  >
                    <option value="us-east-1a">us-east-1a</option>
                    <option value="us-east-1b">us-east-1b</option>
                    <option value="eu-west-1a">eu-west-1a</option>
                  </select>
                )}
                <p className="mt-1 text-[10px] font-mono text-nexus-muted">
                  {configMode === CONFIG_MODE.PRESET && selectedServer
                    ? 'Default zone for the selected region'
                    : 'Isolated location within a region for redundancy'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-nexus-purple uppercase tracking-wider mb-2">
                Environment Variables
              </label>
              <div className="space-y-2">
                {envVars.map((envVar, index) => (
                  <div
                    key={`env-${index}`}
                    className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2"
                  >
                    <Input
                      placeholder="KEY"
                      value={envVar.key}
                      onChange={e => {
                        const next = [...envVars];
                        next[index] = {
                          ...next[index],
                          key: e.target.value,
                          value: next[index]?.value ?? '',
                        };
                        setEnvVars(next);
                      }}
                    />
                    <Input
                      placeholder="value"
                      value={envVar.value}
                      onChange={e => {
                        const next = [...envVars];
                        next[index] = {
                          ...next[index],
                          value: e.target.value,
                          key: next[index]?.key ?? '',
                        };
                        setEnvVars(next);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setEnvVars(prev => prev.filter((_, i) => i !== index))}
                      className="px-3 py-2 border border-nexus-gray text-nexus-muted hover:text-white hover:border-white transition-colors font-mono text-xs"
                      title="Remove"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEnvVars(prev => [...prev, { key: '', value: '' }])}
                >
                  <Plus size={14} /> ADD VARIABLE
                </Button>
              </div>
              <p className="mt-2 text-[10px] font-mono text-nexus-muted">
                Key-value pairs injected into the runtime environment
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Create Button */}
      <div className="flex justify-end mt-8">
        <Button
          size="lg"
          isLoading={createMutation.isPending}
          disabled={createMutation.isPending}
          onClick={() =>
            createMutation.mutate(undefined, {
              onError: err => {
                const msg =
                  err instanceof Error
                    ? err.message
                    : getApiErrorMessage(err, 'Failed to create environment');
                toast.error(msg);
              },
            })
          }
        >
          <Plus size={16} /> CREATE ENVIRONMENT
        </Button>
      </div>
    </PageLayout>
  );
};
