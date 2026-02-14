'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Layers, Plus, Trash2, Settings, Info, ArrowLeft } from 'lucide-react';
import { Button, Input, DashboardTabs } from '@/dashboard/components';
import { PageLayout, DashboardPageHeader } from '@/shared/components/layout';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/shared/auth';
import { useProjects } from '../../projects/hooks/useProjects';
import { createEnvironment } from '@/shared/lib/environments';
import { getApiErrorMessage } from '@/shared/lib';
import type { EnvironmentName, ExecutionMode, EnvironmentVisibility } from '@/shared/types';
import type { EnvironmentConfig } from '@/shared/contracts/environment-config';

type ServerPreset = {
  id: string;
  label: string;
  region: string;
  cpu: string;
  memory: string;
  storage: string;
  network: string;
};

type EnvVar = {
  key: string;
  value: string;
};

const SERVER_PRESETS: ServerPreset[] = [
  {
    id: 'balanced-us-east-1',
    label: 'Balanced (US East)',
    region: 'us-east-1',
    cpu: '2 vCPU',
    memory: '4 GB RAM',
    storage: '80 GB SSD',
    network: '1 Gbps',
  },
  {
    id: 'compute-eu-west-1',
    label: 'Compute (EU West)',
    region: 'eu-west-1',
    cpu: '4 vCPU',
    memory: '8 GB RAM',
    storage: '160 GB SSD',
    network: '2 Gbps',
  },
  {
    id: 'edge-ap-south-1',
    label: 'Edge (AP South)',
    region: 'ap-south-1',
    cpu: '2 vCPU',
    memory: '4 GB RAM',
    storage: '100 GB SSD',
    network: '1 Gbps',
  },
];

export const NewEnvironmentRoute = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const { data: projects = [] } = useProjects();
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');
  const [envName, setEnvName] = useState<EnvironmentName>('dev');
  const [displayName, setDisplayName] = useState('');
  const [executionMode, setExecutionMode] = useState<ExecutionMode>('managed');
  const [visibility, setVisibility] = useState<EnvironmentVisibility>('private');
  const [instanceType, setInstanceType] = useState<'on-demand' | 'spot'>('on-demand');
  const [configMode, setConfigMode] = useState<'preset' | 'custom'>('preset');

  // Preset mode
  const [serverId, setServerId] = useState('');

  // Custom mode
  const [customCpuCores, setCustomCpuCores] = useState(2);
  const [customMemorySize, setCustomMemorySize] = useState(4);
  const [customMemoryUnit, setCustomMemoryUnit] = useState<'GB' | 'TB'>('GB');
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

  const selectedServer = useMemo(
    () => SERVER_PRESETS.find(s => s.id === serverId) || null,
    [serverId]
  );

  // Region and zone: from preset or custom
  const region = configMode === 'preset' ? selectedServer?.region || 'us-east-1' : customRegion;
  const zone =
    configMode === 'preset'
      ? selectedServer?.region
        ? `${selectedServer.region}a`
        : 'us-east-1a'
      : customZone;

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error('Missing auth token');
      if (configMode === 'preset' && !serverId) {
        throw new Error('Please choose a server preset');
      }

      const normalizedEnvVars = envVars
        .map(v => ({ key: v.key.trim(), value: v.value }))
        .filter(v => v.key.length > 0);

      return createEnvironment(token, {
        name: envName,
        displayName: displayName.trim() || envName.toUpperCase(),
        executionMode: executionMode,
        visibility,
        region: region ? region : null,
        environmentClass: envName,
        config: {
          schema_version: 1,
          instanceType,
          configMode,
          zone,
          serverPresetId: configMode === 'preset' ? serverId : null,
          serverPreset: configMode === 'preset' ? selectedServer : null,
          custom:
            configMode === 'custom'
              ? {
                  cpuCores: customCpuCores,
                  memory: { size: customMemorySize, unit: customMemoryUnit },
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
                Scope
              </label>
              <Input value="User-wide (reusable across projects)" disabled />
              <p className="mt-1 text-[10px] font-mono text-nexus-muted">
                Create once, then deploy any project into this environment.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono text-nexus-purple uppercase tracking-wider mb-2">
                Environment Slot *
              </label>
              <select
                value={envName}
                onChange={e => setEnvName(e.target.value as EnvironmentName)}
                className="w-full bg-bg-surface border border-border-dim p-3 font-mono text-sm text-text-primary focus:border-border-highlight focus:ring-1 focus:ring-border-highlight outline-none"
              >
                <option value="dev">Development (dev)</option>
                <option value="prod">Production (prod)</option>
              </select>
              <p className="mt-1 text-[10px] font-mono text-nexus-muted">
                One environment per slot per project (dev/prod).
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono text-nexus-purple uppercase tracking-wider mb-2">
                Display Name
              </label>
              <Input
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="My Dev Environment"
              />
              <p className="mt-1 text-[10px] font-mono text-nexus-muted">
                Optional label shown in the dashboard.
              </p>
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
                  className="w-full bg-bg-surface border border-border-dim p-3 font-mono text-sm text-text-primary focus:border-border-highlight focus:ring-1 focus:ring-border-highlight outline-none"
                >
                  <option value="private">Private</option>
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
                  onClick={() => setInstanceType('on-demand')}
                  className={`p-4 border-2 transition-all ${
                    instanceType === 'on-demand'
                      ? 'border-nexus-accent bg-nexus-accent/10'
                      : 'border-nexus-gray bg-bg-surface hover:border-nexus-light'
                  }`}
                >
                  <div
                    className={`font-mono text-sm font-bold mb-1 ${
                      instanceType === 'on-demand' ? 'text-white' : 'text-nexus-muted'
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
                  onClick={() => setInstanceType('spot')}
                  className={`p-4 border-2 transition-all ${
                    instanceType === 'spot'
                      ? 'border-nexus-accent bg-nexus-accent/10'
                      : 'border-nexus-gray bg-bg-surface hover:border-nexus-light'
                  }`}
                >
                  <div
                    className={`font-mono text-sm font-bold mb-1 ${
                      instanceType === 'spot' ? 'text-white' : 'text-nexus-muted'
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
                  onClick={() => setConfigMode('preset')}
                  className={`p-4 border-2 transition-all ${
                    configMode === 'preset'
                      ? 'border-nexus-purple bg-nexus-purple/10'
                      : 'border-nexus-gray bg-bg-surface hover:border-nexus-light'
                  }`}
                >
                  <div
                    className={`font-mono text-sm font-bold mb-1 ${
                      configMode === 'preset' ? 'text-white' : 'text-nexus-muted'
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
                  onClick={() => setConfigMode('custom')}
                  className={`p-4 border-2 transition-all ${
                    configMode === 'custom'
                      ? 'border-nexus-purple bg-nexus-purple/10'
                      : 'border-nexus-gray bg-bg-surface hover:border-nexus-light'
                  }`}
                >
                  <div
                    className={`font-mono text-sm font-bold mb-1 ${
                      configMode === 'custom' ? 'text-white' : 'text-nexus-muted'
                    }`}
                  >
                    CUSTOM
                  </div>
                  <div className="text-[10px] text-nexus-muted">Configure your own specs</div>
                </button>
              </div>
            </div>

            {configMode === 'preset' ? (
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
                  {SERVER_PRESETS.map(server => (
                    <option key={server.id} value={server.id}>
                      {server.label} · {server.cpu} · {server.memory} · {server.storage}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] font-mono text-nexus-muted">
                  Pre-configured compute resources for your environment
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* CPU */}
                <div>
                  <label className="block text-xs font-mono text-nexus-purple uppercase tracking-wider mb-2">
                    CPU Cores *
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={128}
                      value={customCpuCores}
                      onChange={e => setCustomCpuCores(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-mono text-nexus-muted min-w-[60px]">vCPU</span>
                  </div>
                </div>

                {/* Memory */}
                <div>
                  <label className="block text-xs font-mono text-nexus-purple uppercase tracking-wider mb-2">
                    Memory *
                  </label>
                  <div className="grid grid-cols-[1fr_auto_auto] gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={1024}
                      value={customMemorySize}
                      onChange={e => setCustomMemorySize(Number(e.target.value))}
                    />
                    <select
                      value={customMemoryUnit}
                      onChange={e => setCustomMemoryUnit(e.target.value as 'GB' | 'TB')}
                      className="bg-bg-surface border border-border-dim px-3 py-2 font-mono text-sm text-text-primary focus:border-border-highlight outline-none"
                    >
                      <option value="GB">GB</option>
                      <option value="TB">TB</option>
                    </select>
                    <span className="text-sm font-mono text-nexus-muted flex items-center px-2">
                      RAM
                    </span>
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
                  Specify your custom compute resources with exact values
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
                  Region {configMode === 'preset' && selectedServer && '(Auto-selected)'}
                </label>
                {configMode === 'preset' ? (
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
                    <option value="us-east-1">US East (us-east-1)</option>
                    <option value="eu-west-1">EU West (eu-west-1)</option>
                    <option value="ap-south-1">AP South (ap-south-1)</option>
                  </select>
                )}
                <p className="mt-1 text-[10px] font-mono text-nexus-muted">
                  {configMode === 'preset' && selectedServer
                    ? 'Determined by your selected server preset'
                    : 'Geographic location of your infrastructure'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono text-nexus-purple uppercase tracking-wider mb-2">
                  Availability Zone {configMode === 'preset' && selectedServer && '(Auto-selected)'}
                </label>
                {configMode === 'preset' ? (
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
                  {configMode === 'preset' && selectedServer
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
          disabled={createMutation.isPending || projects.length === 0}
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
