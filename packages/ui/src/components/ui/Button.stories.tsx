import type { Meta, StoryObj } from '@storybook/react';
import { Mail, Trash2 } from 'lucide-react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
    title: 'UI/Button',
    component: Button,
    tags: ['autodocs'],
    args: {
        children: 'Click me',
        variant: 'primary',
        size: 'md',
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'ghost', 'danger'],
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg', 'xl'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {};

export const Secondary: Story = {
    args: { variant: 'secondary' },
};

export const Ghost: Story = {
    args: { variant: 'ghost' },
};

export const Danger: Story = {
    args: { variant: 'danger' },
};

export const Loading: Story = {
    args: { isLoading: true, children: 'Saving…' },
};

export const FullWidth: Story = {
    args: { fullWidth: true },
};

export const Disabled: Story = {
    args: { disabled: true },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex gap-3 flex-wrap items-center">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
            </div>
            <div className="flex gap-3 flex-wrap items-center">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">XL</Button>
            </div>
            <div className="flex gap-3 flex-wrap items-center">
                <Button isLoading>Loading</Button>
                <Button disabled>Disabled</Button>
            </div>
        </div>
    ),
};

export const WithIcons: Story = {
    render: () => (
        <div className="flex gap-3 items-center">
            <Button variant="primary">
                <Mail size={16} />
                Send email
            </Button>
            <Button variant="danger">
                <Trash2 size={16} />
                Delete
            </Button>
        </div>
    ),
};

/** Using `asChild` to render the button styles on an `<a>` element. */
export const AsLink: Story = {
    render: () => (
        <Button asChild variant="secondary">
            <a href="https://pytholit.com" target="_blank" rel="noreferrer">
                Visit Pytholit ↗
            </a>
        </Button>
    ),
};
