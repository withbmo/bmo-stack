import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@pytholit/ui';

interface AuthSubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md';
}

export const AuthSubmitButton = ({ size = 'md', className, ...props }: AuthSubmitButtonProps) => (
  <button
    {...props}
    className={cn(
      'w-full nexus-shadow-btn bg-nexus-purple hover:bg-nexus-purple/90 text-white font-bold uppercase tracking-wider border border-nexus-purple/50 flex items-center justify-center gap-2 font-mono text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed',
      size === 'sm' ? 'px-5 py-2' : 'px-5 py-3',
      className
    )}
  />
);
