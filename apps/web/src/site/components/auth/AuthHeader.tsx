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
            SYSTEM <span className="text-nexus-purple">ACCESS</span>
          </>
        )}
      </h1>
      <p className="font-mono text-xs text-nexus-light/60 tracking-widest uppercase">
        {resolvedSubtitle}
      </p>
    </div>
  );
};
