import type { ReactNode } from 'react';

type AuthMode = 'login' | 'register';

interface AuthHeaderProps {
  mode: AuthMode;
  title?: ReactNode;
  subtitle?: string;
}

export const AuthHeader = ({ mode, title, subtitle }: AuthHeaderProps) => {
  const resolvedSubtitle =
    subtitle ?? (mode === 'login' ? 'Identify yourself' : 'Create your account');

  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-sans font-bold tracking-tighter mb-2">
        {title ?? (
          <>
            SYSTEM <span className="text-brand-primary">ACCESS</span>
          </>
        )}
      </h1>
      <p className="font-mono text-xs text-text-secondary/70 tracking-widest uppercase">
        {resolvedSubtitle}
      </p>
    </div>
  );
};
