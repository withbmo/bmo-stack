'use client';

import { toast } from '@/ui/system';
import { useState } from 'react';

import { AuthLayout } from '@/site/components/auth/AuthLayout';
import { Button } from '@/ui/shadcn/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/shadcn/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/ui/shadcn/ui/field';
import { InputWithIcon } from '@/ui/shadcn/ui/input-with-icon';
import { ArrowRight, Loader2, MailIcon } from 'lucide-react';
import Link from 'next/link';
import { forgotPassword, getApiErrorMessage } from '@/shared/lib/auth';

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
    <AuthLayout>
      <Card className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset password</CardTitle>
          <CardDescription>We&apos;ll email you a reset link</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <InputWithIcon
                  icon={MailIcon}
                  iconLabel="Email"
                  id="email"
                  type="email"
                  placeholder="mexample.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send reset link
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
