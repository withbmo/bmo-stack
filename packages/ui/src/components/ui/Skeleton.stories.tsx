import type { Meta, StoryObj } from '@storybook/react';

import { DynamicSkeletonProvider, DynamicSlot, DynamicValue } from './DynamicSkeleton';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Base: Story = {
  render: () => <Skeleton className="h-4 w-40" />,
};

export const LayoutPlaceholders: Story = {
  render: () => (
    <div className="space-y-3">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-full max-w-xl" />
      <Skeleton className="h-4 w-full max-w-lg" />
      <Skeleton className="h-32 w-full max-w-2xl" />
    </div>
  ),
};

export const DynamicSkeletons: Story = {
  render: () => (
    <DynamicSkeletonProvider loading>
      <div className="space-y-4">
        <DynamicValue className="font-sans text-2xl font-bold">Active deployments</DynamicValue>
        <DynamicValue className="font-mono text-sm text-text-secondary">842</DynamicValue>
        <DynamicSlot skeleton={<Skeleton className="h-10 w-40" />}>
          <button type="button">Refresh</button>
        </DynamicSlot>
      </div>
    </DynamicSkeletonProvider>
  ),
};
