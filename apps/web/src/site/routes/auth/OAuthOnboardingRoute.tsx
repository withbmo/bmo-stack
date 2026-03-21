'use client';

import { toast } from '@/ui/system';
import { AUTH_CONSTANTS } from '@pytholit/validation';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { AuthLayout } from '@/site/components/auth/AuthLayout';
import { Button } from '@/ui/shadcn/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/shadcn/ui/card';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/ui/shadcn/ui/field';
import { InputWithIcon } from '@/ui/shadcn/ui/input-with-icon';
import { FileTextIcon, Loader2, Save, UserIcon } from 'lucide-react';
import { useAuth } from '@/shared/auth';
import { getApiErrorMessage } from '@/shared/lib';
import { completeOAuthOnboarding } from '@/shared/lib/user';

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
    <AuthLayout>
      <Card className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Complete profile</CardTitle>
          <CardDescription>Required to continue</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex min-h-[220px] items-center justify-center text-sm text-muted-foreground">
              <Loader2 size={16} className="mr-2 animate-spin" />
              Loading profile...
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <InputWithIcon
                    icon={UserIcon}
                    iconLabel="Username"
                    id="username"
                    value={form.username}
                    onChange={event => onChange('username', event.target.value)}
                    aria-invalid={Boolean(errors.username)}
                    autoComplete="username"
                    placeholder="your-handle"
                  />
                  <FieldError>{errors.username}</FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor="firstName">First name</FieldLabel>
                  <InputWithIcon
                    icon={UserIcon}
                    iconLabel="First name"
                    id="firstName"
                    value={form.firstName}
                    onChange={event => onChange('firstName', event.target.value)}
                    aria-invalid={Boolean(errors.firstName)}
                    autoComplete="given-name"
                  />
                  <FieldError>{errors.firstName}</FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                  <InputWithIcon
                    icon={UserIcon}
                    iconLabel="Last name"
                    id="lastName"
                    value={form.lastName}
                    onChange={event => onChange('lastName', event.target.value)}
                    aria-invalid={Boolean(errors.lastName)}
                    autoComplete="family-name"
                  />
                  <FieldError>{errors.lastName}</FieldError>
                </Field>

                <Field>
                  <FieldLabel htmlFor="bio">Bio (optional)</FieldLabel>
                  <div className="relative">
                    <div className="text-muted-foreground pointer-events-none absolute left-0 top-0 flex items-center justify-center pl-3 pt-2.5">
                      <FileTextIcon className="size-4" />
                      <span className="sr-only">Bio</span>
                    </div>
                    <textarea
                      id="bio"
                      value={form.bio}
                      onChange={event => onChange('bio', event.target.value)}
                      maxLength={500}
                      placeholder="Tell us about what you build."
                      className="min-h-24 w-full rounded-lg border border-input bg-transparent pl-9 pr-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                  </div>
                </Field>

                <Field>
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Continue
                        <Save size={16} />
                      </>
                    )}
                  </Button>
                  <FieldDescription className="text-center">
                    Back to <a href="/auth/login">login</a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          )}
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
