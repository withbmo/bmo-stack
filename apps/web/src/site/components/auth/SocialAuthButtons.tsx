'use client';

import { Chrome, Github } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { type OAuthProvider, signInWithOAuth } from '@/shared/lib/auth';

const DISAPPEAR_MS = 1000;
const SPIN_BEFORE_REDIRECT_MS = 800;
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
  const [loadingState, setLoadingState] = useState<'idle' | 'disappearing' | 'spinning' | null>(null);
  const [activeProvider, setActiveProvider] = useState<OAuthButtonProvider | null>(null);
  const timeoutIdsRef = useRef<number[]>([]);

  useEffect(
    () => () => {
      timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
      timeoutIdsRef.current = [];
    },
    []
  );

  const schedule = (callback: () => void, ms: number) => {
    const id = window.setTimeout(callback, ms);
    timeoutIdsRef.current.push(id);
  };

  const handleOAuthSignIn = async (provider: OAuthButtonProvider) => {
    setActiveProvider(provider);
    setLoadingState('disappearing');

    // Phase 1: Letters disappear.
    schedule(() => {
      setLoadingState('spinning');

      // Phase 2: Icon spins briefly before redirect.
      schedule(async () => {
        try {
          await signInWithOAuth(provider, next);
        } catch (error) {
          console.error('OAuth sign-in failed:', error);
          setLoadingState('idle');
          setActiveProvider(null);
        }
      }, SPIN_BEFORE_REDIRECT_MS);
    }, DISAPPEAR_MS);
  };

  const isDisappearing = (provider: OAuthButtonProvider) =>
    loadingState === 'disappearing' && activeProvider === provider;

  const isSpinning = (provider: OAuthButtonProvider) =>
    loadingState === 'spinning' && activeProvider === provider;

  const isLoading = (provider: OAuthButtonProvider) =>
    activeProvider === provider && loadingState !== 'idle';

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
            isDisappearing={isDisappearing('github')}
            isSpinning={isSpinning('github')}
            isLoading={isLoading('github')}
          />
        ) : null}
        {enabled.includes('google') ? (
          <SocialButton
            icon={<Chrome size={16} />}
            label="GOOGLE"
            onClick={() => handleOAuthSignIn('google')}
            isDisappearing={isDisappearing('google')}
            isSpinning={isSpinning('google')}
            isLoading={isLoading('google')}
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
  isDisappearing?: boolean;
  isSpinning?: boolean;
  isLoading?: boolean;
}

const SocialButton = ({ 
  icon, 
  label, 
  onClick, 
  isDisappearing, 
  isSpinning, 
  isLoading 
}: SocialButtonProps) => {
  // Split label into individual letters
  const letters = useMemo(() => label.split(''), [label]);

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        relative flex items-center justify-center py-3 
        border border-nexus-gray hover:border-nexus-purple/50 hover:bg-nexus-gray/20 
        transition-all font-mono text-xs group/social 
        text-nexus-light uppercase disabled:cursor-not-allowed
        overflow-hidden
        ${isLoading ? 'border-nexus-purple/50 bg-nexus-gray/20' : ''}
      `}
    >
      {/* 
        Content wrapper - fixed width container that is always centered.
        Width accommodates: icon (16px) + gap (8px) + text width
      */}
      <div className="relative flex items-center justify-center w-[88px]">
        {/* 
          Icon - absolute positioned within the centered container.
          Idle/Disappearing: positioned at left (0px from left edge of container)
          Spinning: positioned at center (translates to center)
        */}
        <span
          className={`
            absolute left-0
            text-nexus-muted group-hover/social:text-white 
            transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            ${isSpinning 
              ? 'left-1/2 -translate-x-1/2 animate-spin-slow text-white' 
              : 'translate-x-0'
            }
            ${isDisappearing ? 'text-white' : ''}
          `}
        >
          {icon}
        </span>

        {/* 
          Text - positioned with left padding to make room for icon.
          Always centered within the container.
        */}
        <span 
          className={`
            flex pl-6
            transition-all duration-500 ease-out
            ${isSpinning ? 'opacity-0 w-0' : 'opacity-100 w-auto'}
          `}
        >
          {letters.map((letter, index) => (
            <span
              key={index}
              className={`
                inline-block transition-all duration-200 ease-in-out flex-shrink-0
                ${isDisappearing 
                  ? 'opacity-0 translate-x-2 scale-75' 
                  : 'opacity-100 translate-x-0 scale-100'
                }
              `}
              style={{
                transitionDelay: isDisappearing 
                  ? `${(letters.length - 1 - index) * 120}ms` // Right to left
                  : `${index * 30}ms`, // Left to right on restore
              }}
            >
              {letter}
            </span>
          ))}
        </span>
      </div>
    </button>
  );
};
