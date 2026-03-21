'use client';

import { GalleryVerticalEnd } from 'lucide-react';
import Link from 'next/link';

export function AuthLayout({
  children,
  maxWidth = 'max-w-md',
}: {
  children: React.ReactNode;
  maxWidth?: string;
}) {
  return (
    <div className="relative flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center gap-6 bg-bg-app p-6 md:p-10">
      <Link href="/" className="relative z-10 flex items-center gap-2 font-medium">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GalleryVerticalEnd className="size-4" />
        </div>
        Pytholit
      </Link>
      <div className={`relative z-10 w-full ${maxWidth}`}>{children}</div>
      <p className="relative z-10 max-w-md px-6 text-center text-sm text-muted-foreground">
        By continuing, you agree to our{' '}
        <Link href="/terms-of-service" className="underline underline-offset-4 hover:text-foreground">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy-policy" className="underline underline-offset-4 hover:text-foreground">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
