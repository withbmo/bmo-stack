import { LivingGrid } from './LivingGrid';

export const BackgroundLayers = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <LivingGrid />
  </div>
);
