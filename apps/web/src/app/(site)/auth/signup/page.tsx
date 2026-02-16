'use client';

import { Suspense } from 'react';

import { SignupRoute } from '@/site/routes/auth';

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-nexus-black" />}>
      <SignupRoute />
    </Suspense>
  );
}
