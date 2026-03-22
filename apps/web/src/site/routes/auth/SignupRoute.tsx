'use client';

import type { TurnstileInstance } from '@marsidev/react-turnstile';
import { toast } from '@/ui/system';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';

import { Turnstile } from '@marsidev/react-turnstile';
import { Button } from '@/ui/shadcn/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/shadcn/ui/card';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '@/ui/shadcn/ui/field';
import { InputWithIcon } from '@/ui/shadcn/ui/input-with-icon';
import { ArrowRight, Chrome, Github, Loader2, LockIcon, MailIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { PasswordStrengthField } from '@/ui/shadcn/ui/password-strength-field';
import { AuthLayout } from '@/site/components/auth/AuthLayout';
import { useAuth } from '@/shared/auth';
import { useAuthForm } from '@/shared/auth/hooks/useAuthForm';
import { usePasswordStrength } from '@/shared/auth/hooks/usePasswordStrength';
import { getTurnstileSiteKey, shouldUseTurnstile } from '@/shared/lib/turnstile';
import {
  type ApiError,
  getApiErrorMessage,
  getApiFieldErrors,
  signInWithOAuth,
  signup,
} from '@/shared/lib/auth';

const TURNSTILE_SITE_KEY = getTurnstileSiteKey();

type OAuthButtonProvider = 'github' | 'google';

export function SignupRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshSession } = useAuth();
  const nextParam = searchParams.get('next');

  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    username,
    setUsername,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    fieldErrors,
    setFieldErrors,
    setFieldError,
    isLoading,
    setIsLoading,
    validatePasswords,
    validateSignupFields,
    clearError,
  } = useAuthForm({ mode: 'register' });

  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const passwordStrength = usePasswordStrength(password);

  const resetTurnstile = useCallback(() => {
    turnstileRef.current?.reset();
    setTurnstileToken('');
  }, []);

  const handleOAuthSignIn = async (provider: OAuthButtonProvider) => {
    try {
      await signInWithOAuth(provider, nextParam || '/dashboard');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'OAuth sign-in failed. Please try again.'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (shouldUseTurnstile() && !turnstileToken) {
      toast.error('Please complete the security check.');
      return;
    }

    if (!validateSignupFields() || !validatePasswords()) {
      return;
    }

    if (!passwordStrength?.isStrong) {
      setFieldError('password', 'Choose a stronger password before continuing.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await signup(
        email,
        password,
        username.trim(),
        firstName.trim(),
        turnstileToken,
        lastName.trim() || undefined
      );

      if (response.status === 'otp_required') {
        const params = new URLSearchParams({
          type: 'email-verification',
          email,
          next: nextParam || '/dashboard',
          expiresAt: response.otpExpiresAt,
          nextRequestAt: response.nextRequestAt,
        });
        toast.success('Account created. Verify your email OTP code to continue.');
        router.replace(`/auth/verify-otp?${params.toString()}`);
        return;
      }

      await refreshSession();
      toast.success('Account created successfully.');
      router.replace(nextParam || '/dashboard');
    } catch (err) {
      resetTurnstile();
      const apiErr = err as ApiError;
      const message = getApiErrorMessage(
        err,
        apiErr.status === 400 || apiErr.status === 422
          ? 'Request failed. Please try again.'
          : 'Request failed'
      );

      if (apiErr.status === 400 && typeof apiErr.detail === 'string') {
        const d = (apiErr.detail as string).toLowerCase();
        if (d.includes('username already taken')) {
          toast.error('Username already taken. Please choose another username.');
          setFieldErrors(current => ({ ...current, username: 'Username already taken.' }));
          return;
        }
      }

      if (apiErr.code === 'AUTH_WEAK_PASSWORD') {
        setFieldError(
          'password',
          typeof apiErr.detail === 'string' ? apiErr.detail : 'Choose a stronger password.'
        );
        return;
      }

      if (apiErr.status === 422) {
        const errors = getApiFieldErrors(err);
        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
          toast.error('Please fix the errors below.');
          return;
        }
      }

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>Sign up to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <Button variant="outline" type="button" onClick={() => handleOAuthSignIn('github')}>
                  <Github size={16} />
                  Sign up with GitHub
                </Button>
                <Button variant="outline" type="button" onClick={() => handleOAuthSignIn('google')}>
                  <Chrome size={16} />
                  Sign up with Google
                </Button>
              </Field>

              <FieldSeparator>Or continue with</FieldSeparator>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <InputWithIcon
                  icon={MailIcon}
                  iconLabel="Email"
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <InputWithIcon
                  icon={UserIcon}
                  iconLabel="Username"
                  id="username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  aria-invalid={!!fieldErrors.username}
                  required
                />
                <FieldError>{fieldErrors.username}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="firstName">First name</FieldLabel>
                <InputWithIcon
                  icon={UserIcon}
                  iconLabel="First name"
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  aria-invalid={!!fieldErrors.firstName}
                  required
                />
                <FieldError>{fieldErrors.firstName}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                <InputWithIcon
                  icon={UserIcon}
                  iconLabel="Last name"
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  aria-invalid={!!fieldErrors.lastName}
                />
                <FieldError>{fieldErrors.lastName}</FieldError>
              </Field>

              <Field>
                <PasswordStrengthField
                  id="password"
                  label="Password"
                  value={password}
                  error={fieldErrors.password}
                  strength={passwordStrength}
                  onChange={value => {
                    setPassword(value);
                    setFieldErrors(current => {
                      if (!current.password) return current;
                      const next = { ...current };
                      delete next.password;
                      return next;
                    });
                  }}
                />
                <FieldError>{fieldErrors.password}</FieldError>
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
                <InputWithIcon
                  icon={LockIcon}
                  iconLabel="Confirm password"
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={e => {
                    setConfirmPassword(e.target.value);
                    setFieldError('confirmPassword');
                  }}
                  aria-invalid={!!fieldErrors.confirmPassword}
                  required
                />
                <FieldError>{fieldErrors.confirmPassword}</FieldError>
              </Field>

              {shouldUseTurnstile() && TURNSTILE_SITE_KEY ? (
                <Field>
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={TURNSTILE_SITE_KEY}
                    options={{ theme: 'dark' }}
                    onSuccess={setTurnstileToken}
                    onExpire={() => setTurnstileToken('')}
                  />
                </Field>
              ) : null}

              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Sign up
                      <ArrowRight size={16} />
                    </>
                  )}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link href="/auth/login">Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
