import { cn } from '@pytholit/ui';

export function AdminPage({
  title,
  subtitle,
  right,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('w-full px-6 py-6', className)}>
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="font-sans text-3xl tracking-tight">{title}</div>
          {subtitle ? (
            <div className="mt-2 font-mono text-xs text-nexus-muted tracking-wider uppercase">
              {subtitle}
            </div>
          ) : null}
        </div>
        {right ? <div className="flex items-center gap-3">{right}</div> : null}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

