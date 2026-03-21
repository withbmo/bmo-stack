'use client';

import { Suspense } from 'react';

import { ResetPasswordRoute } from '@/site/routes/auth';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-app" />}>
      <ResetPasswordRoute />
    </Suspense>
  );
}
