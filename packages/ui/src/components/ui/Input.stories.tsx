import type { Meta, StoryObj } from '@storybook/react';

import { Input } from './Input';

const meta: Meta<typeof Input> = {
    title: 'UI/Input',
    component: Input,
    tags: ['autodocs'],
    args: {
        placeholder: 'Type something…',
        variant: 'default',
        size: 'md',
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'panel', 'ide', 'terminal'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const WithLabel: Story = {
    args: {
        id: 'email',
        label: 'Email address',
        placeholder: 'you@example.com',
        type: 'email',
    },
};

export const WithHint: Story = {
    args: {
        id: 'api-key',
        label: 'API Key',
        hint: 'Your secret API key — never share this.',
        placeholder: 'sk-…',
    },
};

export const WithError: Story = {
    args: {
        id: 'username',
        label: 'Username',
        error: true,
        errorMessage: 'Username is already taken.',
        defaultValue: 'john_doe',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        defaultValue: 'Read-only value',
    },
};

export const Multiline: Story = {
    args: {
        id: 'description',
        label: 'Description',
        multiline: true,
        rows: 4,
        placeholder: 'Describe your project…',
        hint: 'Max 500 characters.',
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-4 max-w-sm">
            <Input variant="default" placeholder="Default" />
            <Input variant="panel" placeholder="Panel" />
            <Input variant="ide" placeholder="IDE" />
            <Input variant="terminal" placeholder="$ terminal" />
        </div>
    ),
};
