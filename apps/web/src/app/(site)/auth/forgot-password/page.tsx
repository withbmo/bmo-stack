'use client';

import { Suspense } from 'react';

import { ForgotPasswordRoute } from '@/site/routes/auth';

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-app" />}>
      <ForgotPasswordRoute />
    </Suspense>
  );
}
