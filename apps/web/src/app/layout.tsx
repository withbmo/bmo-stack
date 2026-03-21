import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { AppBackground } from './AppBackground';
import { Providers } from './providers';
import { cn } from "@/ui/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Pytholit',
  description:
    'A brutalist runtime for teams that ship fast. Build Python runtimes, edit code, and deploy globally without leaving the browser.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={cn("dark", "font-sans", inter.variable)}>
      <body className="min-h-screen">
        <AppBackground />
        <Providers>
          <div className="relative z-10">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
