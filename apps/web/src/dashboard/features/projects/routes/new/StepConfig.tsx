import { ArrowRight, Box, Plus, Settings2, Trash2 } from 'lucide-react';
import { type ChangeEvent, useMemo, useState } from 'react';

import { Button, Input } from '@/dashboard/components';
import {
  DATABASES,
  DJANGO_STRUCTURES,
  FASTAPI_STRUCTURES,
  FRAMEWORKS,
  type ProjectVisibility,
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
  const visibilityOptions: ProjectVisibility[] = ['public', 'private'];

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
        <label className="block font-mono text-sm uppercase tracking-wider text-text-secondary/70">
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
              className="rounded-sm border-2 border-text-muted/40 bg-bg-panel p-6 text-2xl placeholder-text-muted focus:ring-brand-primary/30"
              autoFocus
            />
            <Input
              multiline
              rows={6}
              value={config.description}
              onChange={e => setConfig(c => ({ ...c, description: e.target.value }))}
              placeholder="Describe what this service does, for your team and future you."
              variant="panel"
              intent="brand"
              className="min-h-[140px] w-full flex-1 rounded-sm border border-text-muted/40 bg-bg-panel p-4 text-sm text-white placeholder-text-muted"
            />
          </div>
          <div className="flex flex-col h-full gap-3">
            <div className="flex-1 space-y-3 border border-border-default bg-bg-app p-4">
              <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                Visibility
              </div>
              <div className="flex gap-2">
                {visibilityOptions.map(vis => (
                  <Button
                    key={vis}
                    onClick={() => setConfig(c => ({ ...c, visibility: vis }))}
                    variant="secondary"
                    size="sm"
                    className={`flex-1 border px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                      config.visibility === vis
                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                        : 'border-border-dim text-text-muted hover:text-white'
                    }`}
                  >
                    {vis}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex-1 space-y-3 border border-border-default bg-bg-app p-4">
              <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                Region
              </div>
              <select
                value={config.region}
                onChange={e => setConfig(c => ({ ...c, region: e.target.value }))}
                className="w-full border border-border-dim bg-black/60 px-3 py-2 font-mono text-sm text-white focus:border-brand-primary focus:outline-none"
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
        <label className="block font-mono text-sm uppercase tracking-wider text-text-secondary/70">
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
        <label className="block font-mono text-sm uppercase tracking-wider text-text-secondary/70">
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
        <label className="block font-mono text-sm uppercase tracking-wider text-text-secondary/70">
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
        <label className="block font-mono text-sm uppercase tracking-wider text-text-secondary/70">
          05 // Dependency management
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dependencyOptions.map(manager => (
            <Button
              key={manager}
              type="button"
              onClick={() =>
                setConfig(c => ({
                  ...c,
                  dependencyManager: manager as ProjectWizardConfig['dependencyManager'],
                }))
              }
              variant="secondary"
              size="sm"
              className={`border p-4 text-left font-mono transition-all ${
                config.dependencyManager === manager
                  ? 'border-brand-primary bg-brand-primary/10 text-white'
                  : 'border-border-dim text-text-muted hover:text-white'
              }`}
            >
              <div className="text-sm uppercase">{manager}</div>
              <div className="mt-2 text-[10px] text-text-muted">
                {manager === 'uv'
                  ? 'Fast, modern resolver'
                  : manager === 'poetry'
                    ? 'Lockfile + dependency groups'
                  : 'Classic requirements.txt'}
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="block font-mono text-sm uppercase tracking-wider text-text-secondary/70">
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
            <Button
              key={preset.id}
              onClick={() =>
                setConfig(c => ({
                  ...c,
                  runtimePreset: preset.id,
                  cpu: preset.cpu,
                  memory: preset.memory,
                }))
              }
              variant="secondary"
              size="sm"
              className={`border p-4 text-left font-mono transition-all ${
                config.runtimePreset === preset.id
                  ? 'border-brand-primary bg-brand-primary/10 text-white'
                  : 'border-border-dim text-text-muted hover:text-white'
              }`}
            >
              <div className="text-sm uppercase">{preset.label}</div>
              <div className="mt-2 text-[10px] text-text-muted">
                {preset.cpu} CPU / {preset.memory} MB
              </div>
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
              CPU (units)
            </label>
            <Input
              type="number"
              placeholder="512"
              value={config.cpu}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setConfig(c => ({ ...c, cpu: Number(e.target.value) }))
              }
              className="rounded-sm border border-border-dim bg-black/60 p-3 text-sm placeholder-text-muted"
            />
          </div>
          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
              Memory (MB)
            </label>
            <Input
              type="number"
              placeholder="1024"
              value={config.memory}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setConfig(c => ({ ...c, memory: Number(e.target.value) }))
              }
              className="rounded-sm border border-border-dim bg-black/60 p-3 text-sm placeholder-text-muted"
            />
          </div>
          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
              App Port
            </label>
            <Input
              type="number"
              placeholder="8000"
              value={config.port}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setConfig(c => ({ ...c, port: Number(e.target.value) }))
              }
              className="rounded-sm border border-border-dim bg-black/60 p-3 text-sm placeholder-text-muted"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block font-mono text-sm uppercase tracking-wider text-text-secondary/70">
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
                      ? 'border-brand-primary bg-brand-primary/10 shadow-[0_0_18px_rgba(109,40,217,0.2)]'
                      : 'border-border-default bg-bg-app hover:border-brand-primary/60'
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
                      <span className="block font-mono text-sm text-white">{label}</span>
                      <span className="font-mono text-[10px] text-text-muted">
                        {config.typeHintingLevel.toUpperCase()}
                      </span>
                    </div>
                    <Button
                      type="button"
                      onClick={() => setShowTypeHintDialog(open => !open)}
                      variant="secondary"
                      size="sm"
                      className="border border-border-dim p-2 text-text-muted hover:border-brand-primary hover:text-white"
                      title="Configure type hinting"
                    >
                      <Settings2 size={14} />
                    </Button>
                  </div>
                  {showTypeHintDialog && (
                    <div className="border-t border-border-default/60 px-4 pb-4">
                      <div className="mb-2 mt-3 font-mono text-[10px] uppercase tracking-wider text-text-muted">
                        Type Hinting Level
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {(['basic', 'strict', 'mypy', 'pyright'] as const).map(level => (
                          <Button
                            key={level}
                            type="button"
                            onClick={() =>
                              setConfig(c => ({
                                ...c,
                                typeHintingLevel: level,
                              }))
                            }
                            variant="secondary"
                            size="sm"
                            className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                              config.typeHintingLevel === level
                                ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                                : 'border-border-dim text-text-muted hover:text-white'
                            }`}
                          >
                            {level}
                          </Button>
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
                      ? 'border-brand-primary bg-brand-primary/10 shadow-[0_0_18px_rgba(109,40,217,0.2)]'
                      : 'border-border-default bg-bg-app hover:border-brand-primary/60'
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
                      <span className="block font-mono text-sm text-white">{label}</span>
                      <span className="font-mono text-[10px] text-text-muted">
                        {config.formatterChoice.toUpperCase()}
                      </span>
                    </div>
                    <Button
                      type="button"
                      onClick={() => setShowFormatterDialog(open => !open)}
                      variant="secondary"
                      size="sm"
                      className="border border-border-dim p-2 text-text-muted hover:border-brand-primary hover:text-white"
                      title="Configure formatter"
                    >
                      <Settings2 size={14} />
                    </Button>
                  </div>
                  {showFormatterDialog && (
                    <div className="border-t border-border-default/60 px-4 pb-4">
                      <div className="mb-2 mt-3 font-mono text-[10px] uppercase tracking-wider text-text-muted">
                        Formatter Selection
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {(['ruff', 'black', 'autopep8', 'yapf'] as const).map(fmt => (
                          <Button
                            key={fmt}
                            type="button"
                            onClick={() =>
                              setConfig(c => ({
                                ...c,
                                formatterChoice: fmt,
                              }))
                            }
                            variant="secondary"
                            size="sm"
                            className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                              config.formatterChoice === fmt
                                ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                                : 'border-border-dim text-text-muted hover:text-white'
                            }`}
                          >
                            {fmt}
                          </Button>
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
        <label className="block font-mono text-sm uppercase tracking-wider text-text-secondary/70">
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
              <Button
                onClick={() =>
                  setConfig(c => ({
                    ...c,
                    envVars: c.envVars.filter(row => row.id !== env.id),
                  }))
                }
                variant="secondary"
                size="sm"
                className="border border-border-dim px-3 py-2 text-xs uppercase tracking-wider text-text-muted hover:border-red-500 hover:text-red-500"
              >
                <Trash2 size={12} />
              </Button>
            </div>
          ))}
          <Button
            onClick={() =>
              setConfig(c => ({
                ...c,
                envVars: [...c.envVars, { id: `env-${Date.now()}`, key: '', value: '' }],
              }))
            }
            variant="secondary"
            size="sm"
            className="inline-flex items-center gap-2 border border-border-dim px-3 py-2 text-xs uppercase tracking-wider text-text-muted hover:border-brand-primary hover:text-white"
          >
            <Plus size={12} /> Add env var
          </Button>
        </div>
      </div>

      <div className="flex justify-end pt-8">
        <Button
          onClick={onNext}
          disabled={!config.name}
          variant="primary"
          size="md"
          className="flex items-center gap-3 px-8 py-4 text-sm transition-all enabled:hover:translate-x-1 hover:bg-text-secondary"
        >
          REVIEW CONFIG <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};
