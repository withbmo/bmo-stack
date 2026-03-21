'use client';

import { BackgroundLayers } from '@/ui/blocks';

export function AppBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <BackgroundLayers />
    </div>
  );
}
