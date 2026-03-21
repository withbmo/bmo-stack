import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from './Badge';

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

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge
        variant="success"
        icon={<span aria-hidden="true" className="h-2 w-2 rounded-full bg-current" />}
      >
        Healthy
      </Badge>
      <Badge
        variant="warning"
        icon={<span aria-hidden="true" className="h-2 w-2 rounded-full bg-current" />}
      >
        Pending
      </Badge>
      <Badge
        variant="error"
        icon={<span aria-hidden="true" className="h-2 w-2 rounded-full bg-current" />}
      >
        Failed
      </Badge>
    </div>
  ),
};
