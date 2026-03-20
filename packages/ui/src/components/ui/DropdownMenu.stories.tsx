import type { Meta, StoryObj } from '@storybook/react';
import { Check, ChevronDown, Settings, Sparkles } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './DropdownMenu';

const meta: Meta<typeof DropdownMenu> = {
  title: 'Primitives/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <div className="relative inline-flex">
        <DropdownMenuTrigger className="inline-flex items-center gap-2 border border-border-default bg-bg-panel px-3 py-2 font-mono text-xs uppercase tracking-wider text-text-secondary">
          Agent mode
          <ChevronDown size={12} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
          <DropdownMenuItem className="text-text-secondary hover:bg-border-default/10 hover:text-text-primary">
            <Sparkles size={12} className="mt-0.5 shrink-0" />
            <div>
              <div className="font-bold text-text-primary">Ask</div>
              <div className="mt-0.5 text-[10px] text-text-muted">Question answering mode</div>
            </div>
            <Check size={10} className="ml-auto mt-1 shrink-0 text-brand-primary" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-text-secondary hover:bg-border-default/10 hover:text-text-primary">
            <Settings size={12} className="mt-0.5 shrink-0" />
            <div>
              <div className="font-bold text-text-primary">Agent</div>
              <div className="mt-0.5 text-[10px] text-text-muted">Autonomous multi-file tasks</div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  ),
};
