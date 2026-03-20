import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Guidance/Contributing',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Rules: Story = {
  render: () => (
    <div className="min-h-screen bg-bg-canvas px-8 py-10 text-text-primary">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-brand-accent">
            Design System Guidance
          </p>
          <h1 className="font-sans text-4xl font-bold">How to contribute to `@pytholit/ui`</h1>
          <p className="max-w-3xl text-sm leading-7 text-text-secondary">
            Shared code is allowed into the design system only when it reduces complexity for
            multiple consumers. This page is the fast checklist for deciding whether something
            belongs in `ui`, `blocks`, or app code.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="border border-border-default bg-bg-panel p-5">
            <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-brand-primary">
              Put It In `ui`
            </h2>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              The API is generic, domain-neutral, and should stay stable across unrelated screens.
            </p>
          </article>
          <article className="border border-border-default bg-bg-panel p-5">
            <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-brand-primary">
              Put It In `blocks`
            </h2>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              The pattern is reused across multiple product areas and is built from existing
              primitives.
            </p>
          </article>
          <article className="border border-border-default bg-bg-panel p-5">
            <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-brand-primary">
              Keep It In The App
            </h2>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              The component is route-specific, business-logic-heavy, or hasn’t proven reuse yet.
            </p>
          </article>
        </section>

        <section className="border border-border-default bg-bg-panel p-6">
          <h2 className="font-mono text-xs uppercase tracking-[0.24em] text-brand-accent">
            Checklist
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-text-primary">
                Required before export
              </h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-text-secondary">
                <li>Uses semantic tokens instead of raw palette values.</li>
                <li>Has Storybook coverage for intended usage.</li>
                <li>Has tests when interaction behavior matters.</li>
                <li>Uses `@pytholit/ui/ui` and `@pytholit/ui/blocks` import boundaries.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-text-primary">
                Red flags
              </h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-text-secondary">
                <li>Props mirror one route’s server data shape.</li>
                <li>The component needs multiple exceptions for one consumer.</li>
                <li>It owns navigation side effects instead of explicit props.</li>
                <li>It can’t be explained without feature-specific product context.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  ),
};
