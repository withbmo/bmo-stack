import type { Meta, StoryObj } from '@storybook/react';
import { Info } from 'lucide-react';

import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Primitives/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip content="Runtime health is sampled every 30 seconds.">
      <button
        type="button"
        className="inline-flex items-center gap-2 border border-border-dim bg-bg-panel px-3 py-2 font-mono text-xs uppercase tracking-wider text-text-secondary"
      >
        <Info size={14} />
        Runtime health
      </button>
    </Tooltip>
  ),
};
