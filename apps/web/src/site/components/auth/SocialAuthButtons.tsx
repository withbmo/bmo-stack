'use client';

import { Chrome, Github } from 'lucide-react';
import { useState } from 'react';

import { type OAuthProvider, signInWithOAuth } from '@/shared/lib/auth';

// Static OAuth providers - configured at app build time, not fetched from API
const DEFAULT_PROVIDERS: OAuthProvider[] = ['github', 'google'];
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

  const handleOAuthSignIn = async (provider: OAuthButtonProvider) => {
    setActiveProvider(provider);
    try {
      await signInWithOAuth(provider, next);
    } catch (error) {
      console.error('OAuth sign-in failed:', error);
      setActiveProvider(null);
    }
  };

  const enabled = providers ?? DEFAULT_PROVIDERS;
  if (enabled.length === 0) return null;

  return (
    <>
      <div className="my-8 flex items-center gap-4">
        <div className="h-[1px] bg-nexus-gray flex-1" />
        <span className="font-mono text-[10px] text-nexus-muted uppercase">Or authenticate via</span>
        <div className="h-[1px] bg-nexus-gray flex-1" />
      </div>

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
        border border-nexus-gray hover:border-nexus-purple/50 hover:bg-nexus-gray/20
        font-mono text-xs text-nexus-light uppercase
        disabled:cursor-not-allowed disabled:opacity-60
        ${isLoading ? 'border-nexus-purple/50 bg-nexus-gray/20' : ''}
      `}
    >
      <span className="text-nexus-muted">{icon}</span>
      <span>{label}</span>
    </button>
  );
};
