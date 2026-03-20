import type { Meta, StoryObj } from '@storybook/react';

const COLOR_GROUPS = {
  Surface: [
    ['Canvas', 'bg-bg-canvas'],
    ['App', 'bg-bg-app'],
    ['Panel', 'bg-bg-panel'],
    ['Surface', 'bg-bg-surface'],
    ['Elevated', 'bg-bg-elevated'],
  ],
  Border: [
    ['Subtle', 'bg-border-subtle'],
    ['Dim', 'bg-border-dim'],
    ['Default', 'bg-border-default'],
    ['Strong', 'bg-border-strong'],
    ['Highlight', 'bg-border-highlight'],
  ],
  Text: [
    ['Primary', 'bg-text-primary'],
    ['Secondary', 'bg-text-secondary'],
    ['Muted', 'bg-text-muted'],
  ],
  BrandAndState: [
    ['Brand Primary', 'bg-brand-primary'],
    ['Brand Emphasis', 'bg-brand-emphasis'],
    ['Brand Neon', 'bg-brand-neon'],
    ['Brand Accent', 'bg-brand-accent'],
    ['Success', 'bg-state-success'],
    ['Warning', 'bg-state-warning'],
    ['Error', 'bg-state-error'],
    ['Info', 'bg-state-info'],
  ],
} as const;

const meta: Meta = {
  title: 'Foundations/Colors',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const Palette: Story = {
  render: () => (
    <div className="min-h-screen bg-bg-app p-8 text-text-primary">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand-primary">
            Foundations
          </p>
          <h1 className="font-sans text-4xl font-bold">Semantic Color Roles</h1>
          <p className="max-w-3xl font-mono text-sm text-text-secondary">
            Components should consume semantic roles, not raw palette values. These tokens define
            the visual language shared by primitives, blocks, and app-level UI.
          </p>
        </header>

        {Object.entries(COLOR_GROUPS).map(([group, colors]) => (
          <section key={group} className="space-y-4">
            <h2 className="font-sans text-2xl font-semibold">{group}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {colors.map(([label, className]) => (
                <div key={label} className="overflow-hidden border border-border-dim bg-bg-panel">
                  <div className={`h-28 border-b border-border-dim ${className}`} />
                  <div className="space-y-1 p-4">
                    <div className="font-sans font-semibold text-text-primary">{label}</div>
                    <div className="font-mono text-xs text-text-secondary">{className}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  ),
};
