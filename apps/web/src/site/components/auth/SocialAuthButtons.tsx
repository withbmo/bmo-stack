'use client';

import { Chrome, Github } from 'lucide-react';
import { useState } from 'react';

import { getApiErrorMessage, signInWithOAuth, type OAuthProvider } from '@/shared/lib/auth';

type OAuthButtonProvider = 'github' | 'google';

/**
 * Social authentication buttons (GitHub, Google)
 * Uses Better Auth OAuth flow - POST to /sign-in/social then redirect
 */
export const SocialAuthButtons = ({
  next,
  providers,
}: {
  next?: string;
  providers?: OAuthProvider[];
}) => {
  const [activeProvider, setActiveProvider] = useState<OAuthButtonProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOAuthSignIn = async (provider: OAuthButtonProvider) => {
    setActiveProvider(provider);
    setError(null);
    try {
      await signInWithOAuth(provider, next);
    } catch (err) {
      setActiveProvider(null);
      setError(getApiErrorMessage(err, 'OAuth sign-in failed. Please try again.'));
    }
  };

  const enabled = providers ?? [];
  if (enabled.length === 0) return null;

  return (
    <>
      <div className="my-8 flex items-center gap-4">
        <div className="h-[1px] flex-1 bg-border-default" />
        <span className="font-mono text-[10px] uppercase text-text-muted">Or authenticate via</span>
        <div className="h-[1px] flex-1 bg-border-default" />
      </div>

      {error ? (
        <p className="text-xs text-red-400 font-mono text-center -mt-2 mb-2">{error}</p>
      ) : null}

      <div className={`grid gap-4 ${enabled.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {enabled.includes('github') ? (
          <SocialButton
            icon={<Github size={16} />}
            label="GITHUB"
            onClick={() => handleOAuthSignIn('github')}
            isLoading={activeProvider === 'github'}
          />
        ) : null}
        {enabled.includes('google') ? (
          <SocialButton
            icon={<Chrome size={16} />}
            label="GOOGLE"
            onClick={() => handleOAuthSignIn('google')}
            isLoading={activeProvider === 'google'}
          />
        ) : null}
      </div>
    </>
  );
};

interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isLoading?: boolean;
}

const SocialButton = ({ icon, label, onClick, isLoading }: SocialButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        flex items-center justify-center gap-2 py-3
        border border-border-default hover:border-brand-primary/50 hover:bg-border-default/20
        font-mono text-xs uppercase text-text-primary
        disabled:cursor-not-allowed disabled:opacity-60
        ${isLoading ? 'border-brand-primary/50 bg-border-default/20' : ''}
      `}
    >
      <span className="text-text-muted">{icon}</span>
      <span>{label}</span>
    </button>
  );
};
