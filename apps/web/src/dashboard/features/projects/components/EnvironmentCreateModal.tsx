import { ENVIRONMENT_CLASS } from '@pytholit/contracts';
import { Input, Modal } from '@pytholit/ui';
import { useState } from 'react';

import type { Environment } from '@/shared/types';

interface EnvironmentCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    envType: Environment['envType'];
    displayName: string;
    executionMode: Environment['executionMode'];
    visibility: Environment['visibility'];
    region?: string | null;
    environmentClass: (typeof ENVIRONMENT_CLASS)[keyof typeof ENVIRONMENT_CLASS];
  }) => void;
  isSubmitting?: boolean;
}

const ENV_OPTIONS = Object.values(ENVIRONMENT_CLASS) as Environment['envType'][];

export const EnvironmentCreateModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: EnvironmentCreateModalProps) => {
  const [envType, setEnvType] = useState<Environment['envType']>(ENVIRONMENT_CLASS.DEV);
  const [displayName, setDisplayName] = useState('Dev');
  const [executionMode, setExecutionMode] = useState<Environment['executionMode']>('managed');
  const [visibility, setVisibility] = useState<Environment['visibility']>('private');
  const [region, setRegion] = useState('');

  const defaultDisplayName = envType.charAt(0).toUpperCase() + envType.slice(1);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Environment"
      isLoading={isSubmitting}
      variant="wide"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-nexus-muted mb-2">
            Env Type
          </label>
          <select
            value={envType}
            onChange={event => {
              const next = event.target.value as Environment['envType'];
              const prevDefault = defaultDisplayName;
              setEnvType(next);
              const nextDefault = next.charAt(0).toUpperCase() + next.slice(1);
              if (!displayName.trim() || displayName.trim() === prevDefault) {
                setDisplayName(nextDefault);
              }
            }}
            disabled={isSubmitting}
            className="w-full bg-black/60 border border-border-dim text-white text-sm font-mono px-3 py-2 focus:outline-none focus:border-brand-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {ENV_OPTIONS.map(option => (
              <option key={option} value={option}>
                {option.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-nexus-muted mb-2">
            Display Name
          </label>
          <Input
            value={displayName}
            onChange={event => setDisplayName(event.target.value)}
            placeholder={defaultDisplayName}
            disabled={isSubmitting}
            variant="panel"
            intent="brand"
            size="sm"
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-nexus-muted mb-2">
            Execution Mode
          </label>
          <select
            value={executionMode}
            onChange={event => setExecutionMode(event.target.value as Environment['executionMode'])}
            disabled={isSubmitting}
            className="w-full bg-black/60 border border-border-dim text-white text-sm font-mono px-3 py-2 focus:outline-none focus:border-brand-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="managed">Managed</option>
            <option value="byo_aws">BYO AWS</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-nexus-muted mb-2">
            Visibility
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setVisibility('public')}
              disabled={isSubmitting}
              className={`flex-1 border px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                visibility === 'public'
                  ? 'border-nexus-accent text-nexus-accent bg-nexus-accent/10'
                  : 'border-border-dim text-nexus-muted hover:text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Public
            </button>
            <button
              type="button"
              onClick={() => setVisibility('private')}
              disabled={isSubmitting}
              className={`flex-1 border px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                visibility === 'private'
                  ? 'border-nexus-purple text-nexus-purple bg-nexus-purple/10'
                  : 'border-border-dim text-nexus-muted hover:text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Private
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-nexus-muted mb-2">
              Region
            </label>
            <Input
              value={region}
              onChange={event => setRegion(event.target.value)}
              placeholder="us-east-1"
              disabled={isSubmitting}
              variant="panel"
              intent="brand"
              size="sm"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-end mt-8">
        <button
          type="button"
          onClick={() => !isSubmitting && onClose()}
          disabled={isSubmitting}
          className="px-4 py-2 border border-nexus-gray text-nexus-muted font-mono text-xs font-bold hover:text-white hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() =>
            onSubmit({
              envType,
              displayName: displayName.trim() || defaultDisplayName,
              executionMode: executionMode,
              visibility,
              region: region ? region : null,
              environmentClass: envType,
            })
          }
          className="px-4 py-2 bg-nexus-purple text-white font-mono text-xs font-bold hover:bg-nexus-neon disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'CREATING...' : 'CREATE'}
        </button>
      </div>
    </Modal>
  );
};
