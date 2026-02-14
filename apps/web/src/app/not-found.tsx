import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-nexus-black flex flex-col items-center justify-center p-6 font-sans">
      <h1 className="text-6xl font-bold text-white mb-2 font-mono">404</h1>
      <p className="text-nexus-muted font-mono text-sm mb-6">PAGE_NOT_FOUND</p>
      <Link
        href="/"
        className="px-4 py-2 border border-nexus-purple text-nexus-purple hover:bg-nexus-purple hover:text-white font-mono text-xs font-bold transition-colors"
      >
        RETURN_HOME
      </Link>
    </div>
  );
}
