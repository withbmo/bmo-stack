import { Suspense } from 'react';
import { AdminLoginClient } from './AdminLoginClient';

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-dashboard text-white flex items-center justify-center p-6">
          Loading...
        </div>
      }
    >
      <AdminLoginClient />
    </Suspense>
  );
}

