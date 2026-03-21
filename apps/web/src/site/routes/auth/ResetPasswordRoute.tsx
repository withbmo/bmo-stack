'use client';

import { toast } from '@/ui/system';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

import { AuthLayout } from '@/site/components/auth/AuthLayout';
import { Button } from '@/ui/shadcn/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/shadcn/ui/card';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/ui/shadcn/ui/field';
import { InputWithIcon } from '@/ui/shadcn/ui/input-with-icon';
import { ArrowRight, Loader2, LockIcon } from 'lucide-react';
import Link from 'next/link';
import { PasswordStrengthField } from '@/ui/shadcn/ui/password-strength-field';
import { usePasswordStrength } from '@/shared/auth/hooks/usePasswordStrength';
import { type ApiError, getApiErrorMessage, resetPassword } from '@/shared/lib/auth';

export function ResetPasswordRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const passwordStrength = usePasswordStrength(password);
  const isStrongPassword = passwordStrength?.isStrong ?? false;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!token) {
        toast.error('Invalid reset link. Token is missing.');
        return;
      }

      if (password !== confirmPassword) {
        setFieldErrors({ confirmPassword: 'Passwords do not match.' });
        return;
      }

      if (!password.trim()) {
        setFieldErrors({ password: 'Password is required.' });
        return;
      }

      if (!isStrongPassword) {
        setFieldErrors({ password: 'Choose a stronger password before continuing.' });
        return;
      }

      setFieldErrors({});
      setIsLoading(true);

      try {
        const result = await resetPassword(token, password);

        if (result.status) {
          toast.success('Password reset successfully. Please sign in with your new password.');
          router.replace('/auth/login');
        } else {
          toast.error('Failed to reset password. Please try again.');
        }
      } catch (err) {
        const apiErr = err as ApiError;
        const message = getApiErrorMessage(
          err,
          apiErr.status === 400 || apiErr.status === 422
            ? 'Password reset failed. Please check your reset link and try again.'
            : 'Password reset failed. Please try again.'
        );

        if (apiErr.detail?.includes?.('expired') || apiErr.detail?.includes?.('invalid')) {
          toast.error('Your reset link has expired. Please request a new one.');
        } else if (apiErr.code === 'AUTH_WEAK_PASSWORD' || apiErr.detail?.includes?.('password')) {
          setFieldErrors({
            password:
              typeof apiErr.detail === 'string'
                ? apiErr.detail
                : 'Password does not meet requirements. Please try a different password.',
          });
        } else {
          toast.error(message);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [token, password, confirmPassword, isStrongPassword, router]
  );

  if (!token) {
    return (
      <AuthLayout>
        <Card className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Invalid reset link</CardTitle>
            <CardDescription>The password reset link is invalid or has expired.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <Button asChild type="button">
                  <Link href="/auth/forgot-password">Request new reset link</Link>
                </Button>
              </Field>
              <Field>
                <FieldDescription className="text-center">
                  Back to <Link href="/auth/login">login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Card className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset password</CardTitle>
          <CardDescription>Create a new password for your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <PasswordStrengthField
                  id="password"
                  label="New password"
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
                    setFieldErrors(current => {
                      if (!current.confirmPassword) return current;
                      const next = { ...current };
                      delete next.confirmPassword;
                      return next;
                    });
                  }}
                  aria-invalid={!!fieldErrors.confirmPassword}
                  required
                />
                <FieldError>{fieldErrors.confirmPassword}</FieldError>
              </Field>

              {!isStrongPassword && password.length > 0 ? (
                <FieldDescription>Choose a stronger password before continuing.</FieldDescription>
              ) : null}

              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      Reset password
                      <ArrowRight size={16} />
                    </>
                  )}
                </Button>
                <FieldDescription className="text-center">
                  Back to <Link href="/auth/login">login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
