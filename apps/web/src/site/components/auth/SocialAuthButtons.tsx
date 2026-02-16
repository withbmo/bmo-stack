import { Chrome,Github } from 'lucide-react';

import { getOAuthLoginUrl } from '@/shared/lib/auth';

/**
 * Social authentication buttons (GitHub, Google)
 * Redirects to backend OAuth flow - use full page navigation (not fetch)
 */
export const SocialAuthButtons = ({ next }: { next?: string }) => (
  <>
    <div className="my-8 flex items-center gap-4">
      <div className="h-[1px] bg-nexus-gray flex-1" />
      <span className="font-mono text-[10px] text-nexus-muted uppercase">Or authenticate via</span>
      <div className="h-[1px] bg-nexus-gray flex-1" />
    </div>

    <div className="grid grid-cols-2 gap-4">
      <SocialButton
        icon={<Github size={16} />}
        label="GITHUB"
        href={getOAuthLoginUrl('github', next)}
      />
      <SocialButton
        icon={<Chrome size={16} />}
        label="GOOGLE"
        href={getOAuthLoginUrl('google', next)}
      />
    </div>
  </>
);

interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const SocialButton = ({ icon, label, href }: SocialButtonProps) => (
  <a
    href={href}
    className="flex items-center justify-center gap-2 py-3 border border-nexus-gray hover:border-nexus-purple/50 hover:bg-nexus-gray/20 transition-all font-mono text-xs group/social text-nexus-light uppercase"
  >
    <span className="text-nexus-muted group-hover/social:text-white transition-colors">{icon}</span>
    {label}
  </a>
);
