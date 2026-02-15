'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Button, Card, Input } from '@pytholit/ui';
import { useAuth } from '@/shared/auth';
import { getApiErrorMessage } from '@/shared/lib/client';
import { login } from '@/shared/lib/auth';

export function AdminLoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const redirectTarget = useMemo(() => (nextParam ? nextParam : '/admin'), [nextParam]);

  const { setToken, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace(redirectTarget);
  }, [isAuthenticated, redirectTarget, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const resp = await login(email, password);
      setToken(resp.access_token);
      router.replace(redirectTarget);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Login failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dashboard text-white flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-6 border border-nexus-gray bg-bg-panel">
        <div className="font-sans text-2xl tracking-tight">Admin Login</div>
        <div className="mt-2 font-mono text-xs text-nexus-muted tracking-wider uppercase">
          Use your Pytholit credentials
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <div className="font-mono text-[10px] text-nexus-muted tracking-wider uppercase">
              Email
            </div>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </div>
          <div>
            <div className="font-mono text-[10px] text-nexus-muted tracking-wider uppercase">
              Password
            </div>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
            {isLoading ? 'LOADING...' : 'LOGIN'}
          </Button>
        </form>
      </Card>
    </div>
  );
}

