import { useState } from 'react';
import type { Environment } from '@/shared/types';
import { Modal } from '@pytholit/ui';

interface EnvironmentCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    name: Environment['name'];
    displayName: string;
    executionMode: Environment['executionMode'];
    visibility: Environment['visibility'];
    region?: string | null;
    environmentClass: 'dev' | 'prod';
  }) => void;
  isSubmitting?: boolean;
}

const ENV_OPTIONS: Environment['name'][] = ['dev', 'prod'];

export const EnvironmentCreateModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: EnvironmentCreateModalProps) => {
  const [name, setName] = useState<Environment['name']>('dev');
  const [executionMode, setExecutionMode] = useState<Environment['executionMode']>('managed');
  const [visibility, setVisibility] = useState<Environment['visibility']>('private');
  const [region, setRegion] = useState('');

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
            Name
          </label>
          <select
            value={name}
            onChange={event => setName(event.target.value as Environment['name'])}
            className="w-full bg-black/60 border border-border-dim text-white text-sm font-mono px-3 py-2 focus:outline-none focus:border-brand-primary"
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
            Execution Mode
          </label>
          <select
            value={executionMode}
            onChange={event => setExecutionMode(event.target.value as Environment['executionMode'])}
            className="w-full bg-black/60 border border-border-dim text-white text-sm font-mono px-3 py-2 focus:outline-none focus:border-brand-primary"
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
              className={`flex-1 border px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                visibility === 'public'
                  ? 'border-nexus-accent text-nexus-accent bg-nexus-accent/10'
                  : 'border-border-dim text-nexus-muted hover:text-white'
              }`}
            >
              Public
            </button>
            <button
              type="button"
              onClick={() => setVisibility('private')}
              className={`flex-1 border px-3 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                visibility === 'private'
                  ? 'border-nexus-purple text-nexus-purple bg-nexus-purple/10'
                  : 'border-border-dim text-nexus-muted hover:text-white'
              }`}
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
            <input
              value={region}
              onChange={event => setRegion(event.target.value)}
              placeholder="us-east-1"
              className="w-full bg-black/60 border border-border-dim text-white text-sm font-mono px-3 py-2 focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-end mt-8">
        <button
          type="button"
          onClick={() => !isSubmitting && onClose()}
          className="px-4 py-2 border border-nexus-gray text-nexus-muted font-mono text-xs font-bold hover:text-white hover:border-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() =>
            onSubmit({
              name,
              displayName: name.charAt(0).toUpperCase() + name.slice(1),
              executionMode: executionMode,
              visibility,
              region: region ? region : null,
              environmentClass: name,
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
