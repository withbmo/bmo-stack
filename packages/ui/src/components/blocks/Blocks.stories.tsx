import type { Meta, StoryObj } from '@storybook/react';
import { FileCode2, Layers3 } from 'lucide-react';
import { useState } from 'react';

import { DashboardTabs } from './DashboardTabs';
import { SectionHeader } from './SectionHeader';
import { EmptyState } from './states/EmptyState';
import { LoadingState } from './states/LoadingState';

const meta: Meta = {
  title: 'Blocks/Overview',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj;

export const SectionScaffold: Story = {
  render: () => (
    <div className="max-w-4xl bg-bg-app p-8 text-text-primary">
      <SectionHeader
        badge="WORKFLOW"
        icon={Layers3}
        title={
          <>
            Build reusable <span className="text-brand-primary">sections</span>
          </>
        }
        subtitle="Blocks package exports opinionated compositions built from primitives."
      />
    </div>
  ),
};

export const DashboardNavigation: Story = {
  render: () => {
    const [active, setActive] = useState('overview');

    return (
      <div className="max-w-3xl bg-bg-app p-8 text-text-primary">
        <DashboardTabs
          active={active}
          onChange={setActive}
          tabs={[
            { value: 'overview', label: 'Overview', icon: Layers3 },
            { value: 'artifacts', label: 'Artifacts', icon: FileCode2 },
            { value: 'deployments', label: 'Deployments' },
          ]}
        />
      </div>
    );
  },
};

export const SharedStates: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-4 bg-bg-app p-8">
      <LoadingState message="Loading shared runtime state..." />
      <EmptyState message="No shared resources match the current filters." />
    </div>
  ),
};
