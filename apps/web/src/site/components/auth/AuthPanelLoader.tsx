import { Loader2 } from 'lucide-react';

interface AuthPanelLoaderProps {
  label: string;
}

/**
 * Shared loading state used while auth card dependencies load.
 */
export const AuthPanelLoader = ({ label }: AuthPanelLoaderProps) => (
  <div className="flex min-h-[260px] items-center justify-center">
    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-text-muted">
      <Loader2 size={16} className="animate-spin shrink-0" />
      <span>{label}</span>
    </div>
  </div>
);
