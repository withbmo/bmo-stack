import type { Meta, StoryObj } from '@storybook/react-vite';

import { FormField } from './FormField';
import { Input } from './Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './Select';

const runtimeOptions = [
  { value: 'node', label: 'Node.js' },
  { value: 'bun', label: 'Bun' },
  { value: 'python', label: 'Python' },
];

const meta = {
  title: 'Patterns/FormField',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const TextInput: Story = {
  args: {},
  render: () => (
    <div className="w-[360px]">
      <FormField
        label="Project name"
        htmlFor="project-name"
        hint="Use a short, human-readable name for your workspace."
        required
      >
        <Input id="project-name" placeholder="pytholit-studio" />
      </FormField>
    </div>
  ),
};

export const WithError: Story = {
  args: {},
  render: () => (
    <div className="w-[360px]">
      <FormField
        label="Repository URL"
        htmlFor="repo-url"
        error="Enter a valid Git repository URL."
      >
        <Input id="repo-url" defaultValue="not-a-url" error />
      </FormField>
    </div>
  ),
};

export const SelectField: Story = {
  args: {},
  render: () => (
    <div className="w-[360px]">
      <FormField
        label="Runtime"
        htmlFor="runtime-trigger"
        hint="Choose the default runtime for new generated projects."
      >
        <Select defaultValue="node">
          <SelectTrigger id="runtime-trigger">
            <SelectValue placeholder="Select a runtime" options={runtimeOptions} />
          </SelectTrigger>
          <SelectContent>
            {runtimeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
    </div>
  ),
};
