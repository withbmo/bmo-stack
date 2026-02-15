'use client';

import Link from 'next/link';
import { Button, Card } from '@pytholit/ui';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-bg-dashboard text-white flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-6 border border-nexus-gray bg-bg-panel">
        <div className="font-sans text-2xl tracking-tight">403</div>
        <div className="mt-2 font-mono text-xs text-nexus-muted tracking-wider uppercase">
          Access denied
        </div>
        <div className="mt-6 flex gap-3">
          <Link href="/admin">
            <Button variant="primary">Go to admin</Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="secondary">Login</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

