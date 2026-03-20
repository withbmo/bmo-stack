import type { Meta, StoryObj } from '@storybook/react';

import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Primitives/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    children: 'Card content',
    variant: 'default',
    padding: 'md',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'glass', 'interactive'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-3">
      <Card variant="default">Default panel treatment</Card>
      <Card variant="glass">Glass treatment for elevated contexts</Card>
      <Card variant="interactive">Interactive hover surface</Card>
    </div>
  ),
};
