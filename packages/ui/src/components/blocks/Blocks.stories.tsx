import type { Meta, StoryObj } from '@storybook/react';
import { Brain, FileCode2, Layers3 } from 'lucide-react';
import { useState } from 'react';

import { ResourceCard } from './cards/ResourceCard';
import { TemplateCard } from './cards/TemplateCard';
import { GlitchText } from './common/GlitchText';
import { DashboardTabs } from './DashboardTabs';
import { BackgroundLayers } from './effects/BackgroundLayers';
import { CyberRings } from './effects/CyberRings';
import { LivingGrid } from './effects/LivingGrid';
import { FilterTabButton } from './FilterTabButton';
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

export const SharedCards: Story = {
  render: () => (
    <div className="grid max-w-5xl gap-6 bg-bg-app p-8 md:grid-cols-2">
      <TemplateCard
        template={{
          id: 'template-fastapi',
          title: 'FastAPI Runtime',
          description: 'Pre-wired API runtime with typed routes, docs, and deployment defaults.',
          tags: ['python', 'api', 'runtime'],
          author: 'Pytholit Core',
          stars: 1840,
          isOfficial: true,
        }}
        actionHref="/dashboard/new"
      />
      <ResourceCard
        resource={{
          id: 'resource-skill-tree',
          type: 'skill',
          title: 'Agent Skill Tree',
          description: 'A verified workflow for moving from prompts to maintainable automation.',
          tags: ['agents', 'workflow', 'skills'],
          author: 'Operations',
          stars: 412,
          forks: 37,
          updatedAt: '2d ago',
          verified: true,
        }}
      />
    </div>
  ),
};

export const FilterButtons: Story = {
  render: () => (
    <div className="flex max-w-3xl flex-wrap gap-3 bg-bg-app p-8">
      <FilterTabButton active onClick={() => {}}>
        ALL
      </FilterTabButton>
      <FilterTabButton active={false} onClick={() => {}} icon={Brain}>
        SKILLS
      </FilterTabButton>
      <FilterTabButton active={false} onClick={() => {}} icon={FileCode2}>
        ARTIFACTS
      </FilterTabButton>
    </div>
  ),
};

export const BrandedText: Story = {
  render: () => (
    <div className="max-w-4xl bg-bg-app p-8 text-text-primary">
      <h2 className="font-sans text-4xl font-bold">
        HUMAN <span className="text-text-muted">///</span>{' '}
        <GlitchText
          text="INTELLIGENCE"
          className="bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent"
        />
      </h2>
    </div>
  ),
};

export const AmbientEffects: Story = {
  render: () => (
    <div className="relative h-[480px] overflow-hidden border border-border-default bg-bg-canvas">
      <BackgroundLayers />
      <CyberRings />
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="border border-border-default bg-bg-panel/80 px-6 py-4 font-mono text-xs uppercase tracking-[0.24em] text-text-secondary backdrop-blur">
          Ambient Block Effects
        </div>
      </div>
    </div>
  ),
};

export const LivingGridOnly: Story = {
  render: () => (
    <div className="relative h-[360px] overflow-hidden border border-border-default bg-bg-canvas">
      <LivingGrid />
      <div className="relative z-10 flex h-full items-center justify-center font-mono text-xs uppercase tracking-[0.24em] text-text-secondary">
        LivingGrid
      </div>
    </div>
  ),
};
