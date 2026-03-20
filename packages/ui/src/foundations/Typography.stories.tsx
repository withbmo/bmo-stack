import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Typography',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

const TYPE_SCALE = [
  ['Display', 'text-6xl font-bold leading-none'],
  ['Heading XL', 'text-5xl font-bold leading-tight'],
  ['Heading L', 'text-4xl font-bold leading-tight'],
  ['Heading M', 'text-3xl font-semibold leading-snug'],
  ['Body', 'text-base leading-relaxed'],
  ['Body Small', 'text-sm leading-relaxed'],
  ['Label / Mono', 'font-mono text-xs uppercase tracking-[0.2em]'],
] as const;

export const Scale: Story = {
  render: () => (
    <div className="min-h-screen bg-bg-app p-8 text-text-primary">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand-primary">
            Foundations
          </p>
          <h1 className="font-sans text-4xl font-bold">Typography System</h1>
          <p className="max-w-3xl font-mono text-sm text-text-secondary">
            Space Grotesk carries structure and hierarchy. JetBrains Mono is reserved for controls,
            telemetry, code-oriented UI, and compact labels.
          </p>
        </header>

        <div className="space-y-6">
          {TYPE_SCALE.map(([label, className]) => (
            <div key={label} className="border-b border-border-dim/60 pb-5">
              <div className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
                {label}
              </div>
              <div className={`font-sans ${className}`}>
                Build, ship, and observe runtime-native workloads.
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
