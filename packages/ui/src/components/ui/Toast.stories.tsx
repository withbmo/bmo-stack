import type { Meta, StoryObj } from '@storybook/react';

import { toast, Toaster } from './Toast';

const meta: Meta = {
  title: 'Primitives/Toast',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: () => (
    <div className="flex gap-3">
      <Toaster />
      <button onClick={() => toast.success('Runtime deployed successfully.')}>
        Success toast
      </button>
      <button onClick={() => toast.error('Deployment failed. Check logs.')}>
        Error toast
      </button>
    </div>
  ),
};
