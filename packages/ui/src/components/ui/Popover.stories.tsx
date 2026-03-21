import type { Meta, StoryObj } from '@storybook/react';
import { Bell, Settings, ShieldCheck } from 'lucide-react';

import { Popover, PopoverSection } from './Popover';

const meta: Meta<typeof Popover> = {
  title: 'Primitives/Popover',
  component: Popover,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover trigger="Open quick actions">
      <PopoverSection>
        <div className="font-sans text-sm font-semibold text-text-primary">Quick actions</div>
        <div className="space-y-2 font-mono text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <Bell size={14} className="text-brand-primary" />
            Review recent notifications
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-brand-accent" />
            Confirm runtime health
          </div>
          <div className="flex items-center gap-2">
            <Settings size={14} className="text-text-primary" />
            Open project settings
          </div>
        </div>
      </PopoverSection>
    </Popover>
  ),
};

export const WithCustomTrigger: Story = {
  render: () => (
    <Popover triggerAsChild trigger={<button>Project menu</button>} align="end">
      <PopoverSection>
        <div className="font-sans text-sm font-semibold text-text-primary">Environment</div>
        <p className="font-mono text-xs text-text-secondary">
          Shared popovers can use existing primitive buttons without nesting invalid elements.
        </p>
      </PopoverSection>
    </Popover>
  ),
};
