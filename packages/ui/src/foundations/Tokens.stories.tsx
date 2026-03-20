import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Tokens',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

const SPACING_TOKENS = ['--space-1', '--space-2', '--space-3', '--space-4', '--space-6', '--space-8', '--space-12'];
const RADIUS_TOKENS = ['--radius-sm', '--radius-md', '--radius-lg', '--radius-xl', '--radius-pill'];
const SHADOW_TOKENS = ['--shadow-subtle', '--shadow-panel', '--shadow-brand'];
const Z_INDEX_TOKENS = ['--z-content', '--z-sticky', '--z-overlay', '--z-toast'];

export const Overview: Story = {
  render: () => (
    <div className="min-h-screen bg-bg-app p-8 text-text-primary">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand-primary">
            Foundations
          </p>
          <h1 className="font-sans text-4xl font-bold">Token Overview</h1>
          <p className="max-w-3xl font-mono text-sm text-text-secondary">
            Foundations exist to keep decisions centralized. New primitives should consume these
            tokens before introducing custom values.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="font-sans text-2xl font-semibold">Spacing</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {SPACING_TOKENS.map(token => (
              <div key={token} className="border border-border-dim bg-bg-panel p-4">
                <div className="mb-3 font-mono text-xs text-text-secondary">{token}</div>
                <div
                  className="h-3 bg-brand-primary"
                  style={{ width: `var(${token})` }}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-sans text-2xl font-semibold">Radius</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {RADIUS_TOKENS.map(token => (
              <div key={token} className="border border-border-dim bg-bg-panel p-4">
                <div className="mb-3 font-mono text-xs text-text-secondary">{token}</div>
                <div
                  className="h-16 border border-border-default bg-bg-surface"
                  style={{ borderRadius: `var(${token})` }}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-sans text-2xl font-semibold">Shadows</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {SHADOW_TOKENS.map(token => (
              <div key={token} className="border border-border-dim bg-bg-panel p-6">
                <div className="mb-3 font-mono text-xs text-text-secondary">{token}</div>
                <div
                  className="h-24 border border-border-default bg-bg-surface"
                  style={{ boxShadow: `var(${token})` }}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-sans text-2xl font-semibold">Layering</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {Z_INDEX_TOKENS.map(token => (
              <div key={token} className="border border-border-dim bg-bg-panel p-4">
                <div className="font-mono text-xs text-text-secondary">
                  {token}: {`var(${token})`}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  ),
};
