'use client';

import { Button, Input } from '@pytholit/ui/ui';
import { AUTH_CONSTANTS } from '@pytholit/validation';
import { Loader2, Save } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from '@pytholit/ui/ui';

import { useAuth } from '@/shared/auth';
import { getApiErrorMessage } from '@/shared/lib';
import { completeOAuthOnboarding } from '@/shared/lib/user';
import { AuthCard } from '@/site/components/auth/AuthCard';
import { AuthHeader } from '@/site/components/auth/AuthHeader';
import { AuthPageLayout } from '@/site/components/auth/AuthPageLayout';

type FormState = {
  username: string;
  firstName: string;
  lastName: string;
  bio: string;
};

function normalizeNext(value: string | null): string {
  if (!value) return '/dashboard';
  const trimmed = value.trim();
  if (!trimmed.startsWith('/')) return '/dashboard';
  if (trimmed.startsWith('//')) return '/dashboard';
  if (trimmed.includes('://')) return '/dashboard';
  return trimmed || '/dashboard';
}

export function OAuthOnboardingRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshSession } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>({
    username: '',
    firstName: '',
    lastName: '',
    bio: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const nextTarget = useMemo(() => normalizeNext(searchParams.get('next')), [searchParams]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await refreshSession();
        if (cancelled) return;

        if (!me) {
          router.replace(
            `/auth/login?next=${encodeURIComponent(`/auth/oauth-onboarding?next=${nextTarget}`)}`
          );
          return;
        }

        if (!me.oauthOnboardingRequired) {
          router.replace(nextTarget);
          return;
        }

        setForm({
          username: me.username || '',
          firstName: me.firstName || '',
          lastName: me.lastName || '',
          bio: me.bio || '',
        });
      } catch (err) {
        const message = getApiErrorMessage(err, 'Failed to load account profile.');
        toast.error(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [nextTarget, refreshSession, router]);

  const onChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    const username = form.username.trim();
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();

    if (!username) {
      nextErrors.username = 'Username is required.';
    } else if (!AUTH_CONSTANTS.USERNAME_REGEX.test(username)) {
      nextErrors.username =
        'Use 3-39 chars: letters, numbers, hyphens; no leading/trailing hyphen.';
    }

    if (!firstName) nextErrors.firstName = 'First name is required.';
    if (!lastName) nextErrors.lastName = 'Last name is required.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await completeOAuthOnboarding(undefined, {
        username: form.username.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        bio: form.bio.trim() || null,
      });
      await refreshSession();
      toast.success('Profile completed.');
      router.replace(nextTarget);
    } catch (err) {
      const message = getApiErrorMessage(err, 'Could not complete onboarding.');
      if (message.toLowerCase().includes('username')) {
        setErrors(prev => ({ ...prev, username: message }));
      } else {
        toast.error(message);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthPageLayout>
      <AuthHeader mode="register" title="Complete profile" subtitle="Required to continue" />
      <AuthCard>
        {loading ? (
          <div className="font-mono text-xs uppercase tracking-wider text-text-secondary/70">
            Loading profile…
          </div>
        ) : (
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase tracking-wider text-brand-primary">
                Username
              </label>
              <Input
                value={form.username}
                onChange={event => onChange('username', event.target.value)}
                error={Boolean(errors.username)}
                autoComplete="username"
                placeholder="your-handle"
              />
              {errors.username ? (
                <p className="font-mono text-xs text-red-500">{errors.username}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="font-mono text-xs uppercase tracking-wider text-brand-primary">
                  First name
                </label>
                <Input
                  value={form.firstName}
                  onChange={event => onChange('firstName', event.target.value)}
                  error={Boolean(errors.firstName)}
                  autoComplete="given-name"
                />
                {errors.firstName ? (
                  <p className="font-mono text-xs text-red-500">{errors.firstName}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="font-mono text-xs uppercase tracking-wider text-brand-primary">
                  Last name
                </label>
                <Input
                  value={form.lastName}
                  onChange={event => onChange('lastName', event.target.value)}
                  error={Boolean(errors.lastName)}
                  autoComplete="family-name"
                />
                {errors.lastName ? (
                  <p className="font-mono text-xs text-red-500">{errors.lastName}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs uppercase tracking-wider text-brand-primary">
                Bio (optional)
              </label>
              <Input
                multiline
                rows={4}
                value={form.bio}
                onChange={event => onChange('bio', event.target.value)}
                maxLength={500}
                placeholder="Tell us about what you build."
              />
            </div>

            <Button type="submit" variant="primary" fullWidth disabled={saving} size="sm">
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>SAVING…</span>
                </>
              ) : (
                <>
                  <span>CONTINUE</span>
                  <Save size={16} />
                </>
              )}
            </Button>
          </form>
        )}
      </AuthCard>
    </AuthPageLayout>
  );
}
