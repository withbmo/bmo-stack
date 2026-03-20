import type { Meta, StoryObj } from '@storybook/react';

import { Badge, DeployJobStatusBadge, DeploymentStatusBadge, StatusBadge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    children: 'Runtime status',
    variant: 'success',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'error', 'muted', 'purple'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Base: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="success">Healthy</Badge>
      <Badge variant="warning">Pending</Badge>
      <Badge variant="error">Failed</Badge>
      <Badge variant="muted">Stopped</Badge>
      <Badge variant="purple">Featured</Badge>
    </div>
  ),
};

export const ProductStatuses: Story = {
  render: () => (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-3">
        <StatusBadge status="running" />
        <StatusBadge status="building" />
        <StatusBadge status="stopped" />
        <StatusBadge status="error" />
      </div>
      <div className="flex flex-wrap gap-3">
        <DeploymentStatusBadge status="live" />
        <DeploymentStatusBadge status="deploying" />
        <DeploymentStatusBadge status="stopped" />
        <DeploymentStatusBadge status="failed" />
      </div>
      <div className="flex flex-wrap gap-3">
        <DeployJobStatusBadge status="queued" />
        <DeployJobStatusBadge status="running" />
        <DeployJobStatusBadge status="succeeded" />
        <DeployJobStatusBadge status="failed" />
      </div>
    </div>
  ),
};
