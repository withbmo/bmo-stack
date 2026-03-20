import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-app p-6 font-sans">
      <h1 className="mb-2 font-mono text-6xl font-bold text-text-primary">404</h1>
      <p className="mb-6 font-mono text-sm text-text-muted">PAGE_NOT_FOUND</p>
      <Link
        href="/"
        className="border border-brand-primary px-4 py-2 font-mono text-xs font-bold text-brand-primary transition-colors hover:bg-brand-primary hover:text-white"
      >
        RETURN_HOME
      </Link>
    </div>
  );
}
