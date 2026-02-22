import { ENVIRONMENT_VISIBILITY } from '@pytholit/contracts';
import { ArrowRight, Box, Plus, Settings2, Trash2 } from 'lucide-react';
import { type ChangeEvent, useMemo, useState } from 'react';

import { Input } from '@/dashboard/components';
import {
  DATABASES,
  DJANGO_STRUCTURES,
  FASTAPI_STRUCTURES,
  FRAMEWORKS,
  type ProjectWizardConfig,
  type StructureOption,
  type TechStackOption,
  TOOLING_OPTIONS,
  type ToolingOption,
} from '@/shared/constants/project-wizard';
import type { WizardField, WizardSchema } from '@/shared/types';

import { OptionCard, ToolingCheckbox } from './components';

interface StepConfigProps {
  config: ProjectWizardConfig;
  setConfig: React.Dispatch<React.SetStateAction<ProjectWizardConfig>>;
  schema?: WizardSchema | null;
  onNext: () => void;
}

const getField = (schema: WizardSchema | null | undefined, id: string) => {
  if (!schema) return null;
  for (const step of schema.steps) {
    const field = step.fields.find(f => f.id === id);
    if (field) return field;
  }
  return null;
};

const toTechOptions = (
  field: WizardField | null,
  fallback: TechStackOption[],
  defaultDescription = ''
): TechStackOption[] => {
  if (!field?.options?.length) return [];
  const map = new Map(fallback.map(opt => [opt.id, opt]));
  return field.options.map(opt => {
    const match = map.get(opt.value);
    return (
      match ?? {
        id: opt.value,
        name: opt.label,
        icon: fallback[0]?.icon ?? Box,
        description: defaultDescription,
      }
    );
  });
};

export const StepConfig = ({ config, setConfig, schema, onNext }: StepConfigProps) => {
  const [showFormatterDialog, setShowFormatterDialog] = useState(false);
  const [showTypeHintDialog, setShowTypeHintDialog] = useState(false);
  const schemaFrameworkField = useMemo(() => getField(schema, 'framework'), [schema]);
  const schemaDatabaseField = useMemo(() => getField(schema, 'databases'), [schema]);
  const schemaDependencyField = useMemo(() => getField(schema, 'dependencyManager'), [schema]);
  const frameworkOptions = useMemo(
    () => toTechOptions(schemaFrameworkField, FRAMEWORKS),
    [schemaFrameworkField]
  );
  const databaseOptions = useMemo(
    () => toTechOptions(schemaDatabaseField, DATABASES),
    [schemaDatabaseField]
  );
  const dependencyOptions = useMemo(() => {
    if (!schemaDependencyField?.options?.length) return [];
    return schemaDependencyField.options.map(opt => opt.value);
  }, [schemaDependencyField]);
  const structures: StructureOption[] =
    config.framework === 'fastapi' ? FASTAPI_STRUCTURES : DJANGO_STRUCTURES;

  const toggleDatabase = (id: string) => {
    setConfig((prev: ProjectWizardConfig) => ({
      ...prev,
      databases: prev.databases.includes(id)
        ? prev.databases.filter(d => d !== id)
        : [...prev.databases, id],
    }));
  };

  const setFramework = (id: 'fastapi' | 'django') => {
    setConfig((prev: ProjectWizardConfig) => ({
      ...prev,
      framework: id,
      structure: id === 'fastapi' ? 'nested' : 'apps',
    }));
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="space-y-6">
        <label className="font-mono text-sm text-nexus-light/70 uppercase tracking-wider block">
          01 // Project Identity
        </label>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col h-full gap-3">
            <Input
              type="text"
              placeholder="my-awesome-app"
              value={config.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setConfig((c: ProjectWizardConfig) => ({
                  ...c,
                  name: e.target.value,
                }))
              }
              className="bg-nexus-dark border-2 border-nexus-muted/40 rounded-sm p-6 text-2xl placeholder-nexus-muted focus:ring-nexus-purple/30"
              autoFocus
            />
            <textarea
              value={config.description}
              onChange={e => setConfig(c => ({ ...c, description: e.target.value }))}
              placeholder="Describe what this service does, for your team and future you."
              className="w-full min-h-[140px] flex-1 bg-nexus-dark border border-nexus-muted/40 rounded-sm p-4 text-sm text-white placeholder-nexus-muted focus:outline-none focus:border-nexus-purple/60"
            />
          </div>
          <div className="flex flex-col h-full gap-3">
            <div className="border border-nexus-gray bg-[#080808] p-4 space-y-3 flex-1">
              <div className="text-[10px] font-mono text-nexus-muted uppercase tracking-wider">
                Visibility
              </div>
              <div className="flex gap-2">
                {(
                  Object.values(ENVIRONMENT_VISIBILITY) as Array<
                    (typeof ENVIRONMENT_VISIBILITY)[keyof typeof ENVIRONMENT_VISIBILITY]
                  >
                ).map(vis => (
                  <button
                    key={vis}
                    onClick={() => setConfig(c => ({ ...c, visibility: vis }))}
                    className={`flex-1 border px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                      config.visibility === vis
                        ? 'border-nexus-purple text-nexus-purple bg-nexus-purple/10'
                        : 'border-border-dim text-nexus-muted hover:text-white'
                    }`}
                  >
                    {vis}
                  </button>
                ))}
              </div>
            </div>
            <div className="border border-nexus-gray bg-[#080808] p-4 space-y-3 flex-1">
              <div className="text-[10px] font-mono text-nexus-muted uppercase tracking-wider">
                Region
              </div>
              <select
                value={config.region}
                onChange={e => setConfig(c => ({ ...c, region: e.target.value }))}
                className="w-full bg-black/60 border border-border-dim text-white text-sm font-mono px-3 py-2 focus:outline-none focus:border-brand-primary"
              >
                {['us-east-1', 'us-west-2', 'eu-west-2', 'ap-south-1'].map(region => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="font-mono text-sm text-nexus-light/70 uppercase tracking-wider block">
          02 // Framework
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {frameworkOptions.map((fw: TechStackOption) => (
            <OptionCard
              key={fw.id}
              selected={config.framework === fw.id}
              onSelect={() => setFramework(fw.id as 'fastapi' | 'django')}
              icon={fw.icon}
              name={fw.name}
              description={fw.description}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="font-mono text-sm text-nexus-light/70 uppercase tracking-wider block">
          03 // Persistence (Optional)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {databaseOptions.map((db: TechStackOption) => (
            <OptionCard
              key={db.id}
              selected={config.databases.includes(db.id)}
              onSelect={() => toggleDatabase(db.id)}
              icon={db.icon}
              name={db.name}
              description={db.description}
              accent="accent"
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="font-mono text-sm text-nexus-light/70 uppercase tracking-wider block">
          04 // Project structure
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {structures.map((s: StructureOption) => (
            <OptionCard
              key={s.id}
              selected={config.structure === s.id}
              onSelect={() =>
                setConfig((c: ProjectWizardConfig) => ({
                  ...c,
                  structure: s.id,
                }))
              }
              icon={Box}
              name={s.name}
              description={s.description}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="font-mono text-sm text-nexus-light/70 uppercase tracking-wider block">
          05 // Dependency management
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dependencyOptions.map(manager => (
            <button
              key={manager}
              type="button"
              onClick={() =>
                setConfig(c => ({
                  ...c,
                  dependencyManager: manager as ProjectWizardConfig['dependencyManager'],
                }))
              }
              className={`border p-4 text-left font-mono transition-all ${
                config.dependencyManager === manager
                  ? 'border-nexus-purple bg-nexus-purple/10 text-white'
                  : 'border-border-dim text-nexus-muted hover:text-white'
              }`}
            >
              <div className="text-sm uppercase">{manager}</div>
              <div className="text-[10px] text-nexus-muted mt-2">
                {manager === 'uv'
                  ? 'Fast, modern resolver'
                  : manager === 'poetry'
                    ? 'Lockfile + dependency groups'
                    : 'Classic requirements.txt'}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="font-mono text-sm text-nexus-light/70 uppercase tracking-wider block">
          06 // Runtime sizing
        </label>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {(
            [
              { id: 'small', label: 'Small', cpu: 512, memory: 1024 },
              { id: 'medium', label: 'Medium', cpu: 1024, memory: 2048 },
              { id: 'large', label: 'Large', cpu: 2048, memory: 4096 },
            ] as const
          ).map(preset => (
            <button
              key={preset.id}
              onClick={() =>
                setConfig(c => ({
                  ...c,
                  runtimePreset: preset.id,
                  cpu: preset.cpu,
                  memory: preset.memory,
                }))
              }
              className={`border p-4 text-left font-mono transition-all ${
                config.runtimePreset === preset.id
                  ? 'border-nexus-purple bg-nexus-purple/10 text-white'
                  : 'border-border-dim text-nexus-muted hover:text-white'
              }`}
            >
              <div className="text-sm uppercase">{preset.label}</div>
              <div className="text-[10px] text-nexus-muted mt-2">
                {preset.cpu} CPU / {preset.memory} MB
              </div>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-nexus-muted">
              CPU (units)
            </label>
            <Input
              type="number"
              placeholder="512"
              value={config.cpu}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setConfig(c => ({ ...c, cpu: Number(e.target.value) }))
              }
              className="bg-black/60 border border-border-dim rounded-sm p-3 text-sm placeholder-nexus-muted"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-nexus-muted">
              Memory (MB)
            </label>
            <Input
              type="number"
              placeholder="1024"
              value={config.memory}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setConfig(c => ({ ...c, memory: Number(e.target.value) }))
              }
              className="bg-black/60 border border-border-dim rounded-sm p-3 text-sm placeholder-nexus-muted"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono uppercase tracking-wider text-nexus-muted">
              App Port
            </label>
            <Input
              type="number"
              placeholder="8000"
              value={config.port}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setConfig(c => ({ ...c, port: Number(e.target.value) }))
              }
              className="bg-black/60 border border-border-dim rounded-sm p-3 text-sm placeholder-nexus-muted"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="font-mono text-sm text-nexus-light/70 uppercase tracking-wider block">
          07 // Tooling & scaffolding
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLING_OPTIONS.map(({ key, label }: ToolingOption) => {
            if (key === 'typeHinting') {
              return (
                <div
                  key={key}
                  className={`border transition-all ${
                    config.typeHinting
                      ? 'border-nexus-purple bg-nexus-purple/10 shadow-[0_0_18px_rgba(109,40,217,0.2)]'
                      : 'border-nexus-gray bg-[#080808] hover:border-nexus-purple/60'
                  }`}
                >
                  <div className="flex items-center gap-4 p-4">
                    <input
                      type="checkbox"
                      checked={config.typeHinting}
                      onChange={e =>
                        setConfig(c => ({
                          ...c,
                          typeHinting: e.target.checked,
                        }))
                      }
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <span className="font-mono text-sm text-white block">{label}</span>
                      <span className="font-mono text-[10px] text-nexus-muted">
                        {config.typeHintingLevel.toUpperCase()}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowTypeHintDialog(open => !open)}
                      className="p-2 border border-border-dim text-nexus-muted hover:text-white hover:border-nexus-purple transition-colors"
                      title="Configure type hinting"
                    >
                      <Settings2 size={14} />
                    </button>
                  </div>
                  {showTypeHintDialog && (
                    <div className="border-t border-nexus-gray/60 px-4 pb-4">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-nexus-muted mt-3 mb-2">
                        Type Hinting Level
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {(['basic', 'strict', 'mypy', 'pyright'] as const).map(level => (
                          <button
                            key={level}
                            type="button"
                            onClick={() =>
                              setConfig(c => ({
                                ...c,
                                typeHintingLevel: level,
                              }))
                            }
                            className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                              config.typeHintingLevel === level
                                ? 'border-nexus-purple text-nexus-purple bg-nexus-purple/10'
                                : 'border-border-dim text-nexus-muted hover:text-white'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            if (key === 'formatters') {
              return (
                <div
                  key={key}
                  className={`border transition-all ${
                    config.formatters
                      ? 'border-nexus-purple bg-nexus-purple/10 shadow-[0_0_18px_rgba(109,40,217,0.2)]'
                      : 'border-nexus-gray bg-[#080808] hover:border-nexus-purple/60'
                  }`}
                >
                  <div className="flex items-center gap-4 p-4">
                    <input
                      type="checkbox"
                      checked={config.formatters}
                      onChange={e => setConfig(c => ({ ...c, formatters: e.target.checked }))}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <span className="font-mono text-sm text-white block">{label}</span>
                      <span className="font-mono text-[10px] text-nexus-muted">
                        {config.formatterChoice.toUpperCase()}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowFormatterDialog(open => !open)}
                      className="p-2 border border-border-dim text-nexus-muted hover:text-white hover:border-nexus-purple transition-colors"
                      title="Configure formatter"
                    >
                      <Settings2 size={14} />
                    </button>
                  </div>
                  {showFormatterDialog && (
                    <div className="border-t border-nexus-gray/60 px-4 pb-4">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-nexus-muted mt-3 mb-2">
                        Formatter Selection
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {(['ruff', 'black', 'autopep8', 'yapf'] as const).map(fmt => (
                          <button
                            key={fmt}
                            type="button"
                            onClick={() =>
                              setConfig(c => ({
                                ...c,
                                formatterChoice: fmt,
                              }))
                            }
                            className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                              config.formatterChoice === fmt
                                ? 'border-nexus-purple text-nexus-purple bg-nexus-purple/10'
                                : 'border-border-dim text-nexus-muted hover:text-white'
                            }`}
                          >
                            {fmt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            return (
              <ToolingCheckbox
                key={key}
                checked={config[key]}
                onChange={checked => setConfig(c => ({ ...c, [key]: checked }))}
                label={label}
              />
            );
          })}
        </div>
        {config.framework === 'fastapi' && (
          <ToolingCheckbox
            checked={config.alembic}
            onChange={checked => setConfig(c => ({ ...c, alembic: checked }))}
            label="Add Alembic (migrations)"
          />
        )}
      </div>

      <div className="space-y-4">
        <label className="font-mono text-sm text-nexus-light/70 uppercase tracking-wider block">
          08 // Environment variables
        </label>
        <div className="space-y-3">
          {config.envVars.map(env => (
            <div key={env.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
              <Input
                value={env.key}
                onChange={e =>
                  setConfig(c => ({
                    ...c,
                    envVars: c.envVars.map(row =>
                      row.id === env.id ? { ...row, key: e.target.value } : row
                    ),
                  }))
                }
                placeholder="KEY"
                className="md:col-span-2"
                variant="panel"
                intent="brand"
                size="sm"
              />
              <Input
                value={env.value}
                onChange={e =>
                  setConfig(c => ({
                    ...c,
                    envVars: c.envVars.map(row =>
                      row.id === env.id ? { ...row, value: e.target.value } : row
                    ),
                  }))
                }
                placeholder="value"
                className="md:col-span-2"
                variant="panel"
                intent="brand"
                size="sm"
              />
              <button
                onClick={() =>
                  setConfig(c => ({
                    ...c,
                    envVars: c.envVars.filter(row => row.id !== env.id),
                  }))
                }
                className="border border-border-dim text-nexus-muted hover:text-red-500 hover:border-red-500 px-3 py-2 text-xs font-mono uppercase tracking-wider"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              setConfig(c => ({
                ...c,
                envVars: [...c.envVars, { id: `env-${Date.now()}`, key: '', value: '' }],
              }))
            }
            className="inline-flex items-center gap-2 border border-border-dim text-nexus-muted hover:text-white hover:border-nexus-purple px-3 py-2 text-xs font-mono uppercase tracking-wider"
          >
            <Plus size={12} /> Add env var
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-8">
        <button
          onClick={onNext}
          disabled={!config.name}
          className={`bg-white text-black font-mono font-bold text-sm px-8 py-4 flex items-center gap-3 transition-all hover:bg-nexus-light ${
            !config.name ? 'opacity-50 cursor-not-allowed' : 'hover:translate-x-1'
          }`}
        >
          REVIEW CONFIG <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
