import type { Meta, StoryObj } from '@storybook/react';

import { MotionFade, MotionScaleIn, MotionSlideIn, MotionStagger } from './primitives';
import { MOTION_DISTANCE, MOTION_DURATION, MOTION_EASE } from './tokens';

const meta: Meta = {
  title: 'Motion/Overview',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const Guidelines: Story = {
  render: () => (
    <div className="min-h-screen bg-bg-app p-8 text-text-primary">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand-primary">
            Motion
          </p>
          <h1 className="font-sans text-4xl font-bold">Motion Principles</h1>
          <p className="max-w-3xl font-mono text-sm text-text-secondary">
            Motion in Pytholit should clarify hierarchy and state changes. It should never become
            the product itself.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="border border-border-dim bg-bg-panel p-4">
            <div className="font-mono text-xs text-text-secondary">Durations</div>
            <pre className="mt-3 font-mono text-xs text-text-primary">
              {JSON.stringify(MOTION_DURATION, null, 2)}
            </pre>
          </div>
          <div className="border border-border-dim bg-bg-panel p-4">
            <div className="font-mono text-xs text-text-secondary">Ease</div>
            <pre className="mt-3 font-mono text-xs text-text-primary">
              {JSON.stringify(MOTION_EASE, null, 2)}
            </pre>
          </div>
          <div className="border border-border-dim bg-bg-panel p-4">
            <div className="font-mono text-xs text-text-secondary">Distance</div>
            <pre className="mt-3 font-mono text-xs text-text-primary">
              {JSON.stringify(MOTION_DISTANCE, null, 2)}
            </pre>
          </div>
        </div>

        <MotionStagger className="grid gap-4 md:grid-cols-3">
          <MotionFade className="border border-border-dim bg-bg-panel p-6">
            Fade for subtle presence changes and low-emphasis entrances.
          </MotionFade>
          <MotionSlideIn className="border border-border-dim bg-bg-panel p-6">
            Slide for directional movement and screen-level transitions.
          </MotionSlideIn>
          <MotionScaleIn className="border border-border-dim bg-bg-panel p-6">
            Scale for overlays, dialogs, and focused reveal moments.
          </MotionScaleIn>
        </MotionStagger>
      </div>
    </div>
  ),
};
