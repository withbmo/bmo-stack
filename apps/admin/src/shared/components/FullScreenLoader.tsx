'use client';

export function FullScreenLoader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="min-h-screen bg-bg-dashboard text-white flex items-center justify-center">
      <div className="font-mono text-xs text-nexus-muted tracking-wider uppercase">{label}</div>
    </div>
  );
}

