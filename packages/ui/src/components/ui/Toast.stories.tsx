import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './Button';
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
      <Button variant="secondary" onClick={() => toast.success('Runtime deployed successfully.')}>
        Success toast
      </Button>
      <Button variant="ghost" onClick={() => toast.error('Deployment failed. Check logs.')}>
        Error toast
      </Button>
    </div>
  ),
};
