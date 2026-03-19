import type { PasswordStrengthResponse } from '@pytholit/contracts';
import { CheckCircle2, CircleAlert } from 'lucide-react';

const strengthBarClasses = [
  'bg-red-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-green-500',
  'bg-emerald-500',
] as const;

type PasswordStrengthGuidanceProps = {
  strength: PasswordStrengthResponse | null;
  error?: string;
};

export function PasswordStrengthGuidance({
  strength,
  error,
}: PasswordStrengthGuidanceProps) {
  if (!strength && !error) return null;

  const activeSegments = strength ? strength.score + 1 : 0;

  return (
    <div className="space-y-3">
      {strength ? (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider">
              <span className="text-nexus-muted">Password strength</span>
              <span className={strength.isStrong ? 'text-green-400' : 'text-yellow-400'}>
                {strength.label}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {Array.from({ length: 4 }).map((_, index) => {
                const isActive = index < activeSegments;
                const barClass = strengthBarClasses[Math.min(strength.score, strengthBarClasses.length - 1)];
                return (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full ${isActive ? barClass : 'bg-nexus-border/60'}`}
                  />
                );
              })}
            </div>
          </div>

          {strength.strengths.length > 0 ? (
            <div className="space-y-1">
              <p className="font-mono text-[11px] uppercase tracking-wider text-green-400">
                Strength points
              </p>
              <ul className="space-y-1">
                {strength.strengths.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 font-mono text-xs text-green-300"
                  >
                    <CheckCircle2 size={12} className="mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {strength.weaknesses.length > 0 ? (
            <div className="space-y-1">
              <p className="font-mono text-[11px] uppercase tracking-wider text-amber-400">
                Weakness points
              </p>
              <ul className="space-y-1">
                {strength.weaknesses.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 font-mono text-xs text-amber-300"
                  >
                    <CircleAlert size={12} className="mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </>
      ) : null}

      {error ? <p className="font-mono text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
