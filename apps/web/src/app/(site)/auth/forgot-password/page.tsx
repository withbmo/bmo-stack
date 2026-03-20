'use client';

import { Suspense } from 'react';

import { ForgotPasswordRoute } from '@/site/routes/auth/ForgotPasswordRoute';

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-app" />}>
      <ForgotPasswordRoute />
    </Suspense>
  );
}
