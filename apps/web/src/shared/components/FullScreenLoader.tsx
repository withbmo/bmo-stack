import { Loader2 } from 'lucide-react';

export function FullScreenLoader({
  label = 'Loading...',
  backgroundClassName = 'bg-bg-app',
}: {
  label?: string;
  backgroundClassName?: string;
}) {
  return (
    <div className={`min-h-screen ${backgroundClassName} flex items-center justify-center`}>
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-nexus-purple" size={48} />
        <span className="font-mono text-xs text-nexus-muted animate-pulse">{label}</span>
      </div>
    </div>
  );
}

