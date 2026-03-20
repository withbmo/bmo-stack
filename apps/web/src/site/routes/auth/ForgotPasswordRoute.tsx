'use client';

import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from '@pytholit/ui/ui';

import { forgotPassword, getApiErrorMessage } from '@/shared/lib/auth';
import { AuthCard } from '@/site/components/auth/AuthCard';
import { AuthHeader } from '@/site/components/auth/AuthHeader';
import { AuthPageLayout } from '@/site/components/auth/AuthPageLayout';
import { AuthSubmitButton } from '@/site/components/auth/AuthSubmitButton';
import { EmailField } from '@/site/components/auth/FormFields';

export function ForgotPasswordRoute() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email, '/auth/reset-password');
      toast.success('If that email exists, a reset message has been sent.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to request password reset.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout>
      <AuthHeader mode="login" />
      <AuthCard>
        <div className="mb-6 text-center">
          <h2 className="font-mono text-sm uppercase tracking-wider text-text-secondary">
            Reset password
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <EmailField value={email} onChange={setEmail} placeholder="you@example.com" />
          <AuthSubmitButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin shrink-0" />
                <span>SENDING...</span>
              </>
            ) : (
              <>
                Send reset link <ArrowRight size={16} />
              </>
            )}
          </AuthSubmitButton>
        </form>
        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="font-mono text-xs uppercase tracking-wider text-text-muted underline decoration-dotted underline-offset-4 transition-colors hover:text-brand-primary"
          >
            Back to login
          </Link>
        </div>
      </AuthCard>
    </AuthPageLayout>
  );
}
