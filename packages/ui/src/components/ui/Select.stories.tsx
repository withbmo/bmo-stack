import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Select';

const OPTIONS = [
  { value: 'us-east', label: 'US East (Virginia)' },
  { value: 'eu-west', label: 'EU West (Ireland)' },
  { value: 'ap-syd', label: 'AP Southeast (Sydney)' },
];

const meta: Meta<typeof Select> = {
  title: 'Primitives/Select',
  component: Select,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <div className="relative max-w-sm">
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a region..." options={OPTIONS} />
          </SelectTrigger>
          <SelectContent>
            {OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  },
};
