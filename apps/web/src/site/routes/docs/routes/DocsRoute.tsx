'use client';

import { BackgroundLayers } from '@pytholit/ui/blocks';
import { BookOpen, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type DocEntry = { slug: string; title: string };

interface DocsRouteProps {
  initialSlug?: string;
}

export function DocsRoute({ initialSlug }: DocsRouteProps) {
  const router = useRouter();
  const [manifest, setManifest] = useState<DocEntry[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeSlug = useMemo(() => initialSlug ?? manifest[0]?.slug ?? '', [initialSlug, manifest]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/docs/manifest.json');
        const data = (await res.json()) as DocEntry[];
        if (cancelled) return;
        setManifest(data);
        const firstDoc = data[0];
        if (!initialSlug && firstDoc) {
          router.replace(`/docs/${firstDoc.slug}`);
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load docs');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialSlug, router]);

  useEffect(() => {
    if (!activeSlug) {
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await fetch(`/docs/${activeSlug}.md`);
        if (!res.ok) {
          throw new Error('Not found');
        }
        const data = await res.text();
        if (!cancelled) {
          setContent(data);
        }
      } catch {
        if (!cancelled) {
          setError('Doc not found');
          setContent('');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeSlug]);

  return (
    <div className="min-h-screen relative pt-28 pb-20 px-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <BackgroundLayers />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex gap-12">
          <aside className="w-56 shrink-0 border-r border-nexus-gray pr-6 hidden md:block">
            <div className="flex items-center gap-2 px-3 py-1 mb-6 border border-nexus-purple/50 bg-nexus-purple/10 text-nexus-purple font-mono text-xs tracking-widest w-fit">
              <BookOpen size={12} /> DOCS
            </div>

            <nav className="space-y-0.5">
              {manifest.map(doc => (
                <Link
                  key={doc.slug}
                  href={`/docs/${doc.slug}`}
                  className={`flex items-center gap-2 px-3 py-2 font-mono text-sm border-l-2 transition-colors ${
                    activeSlug === doc.slug
                      ? 'border-nexus-purple bg-nexus-purple/10 text-white'
                      : 'border-transparent text-nexus-muted hover:text-white hover:bg-nexus-gray/10 hover:border-nexus-gray'
                  }`}
                >
                  <FileText size={14} />
                  {doc.title}
                </Link>
              ))}
            </nav>
          </aside>

          <main className="flex-1 min-w-0 max-w-3xl">
            {error && (
              <div className="font-mono text-nexus-muted border border-nexus-gray p-6 bg-nexus-dark/50">
                {error}.{' '}
                <Link href="/docs" className="text-nexus-purple hover:underline">
                  Back to docs
                </Link>
                .
              </div>
            )}

            {loading && !content && !error && (
              <div className="font-mono text-nexus-muted animate-pulse">Loading...</div>
            )}

            {content && !error && (
              <article className="docs-content border border-nexus-gray bg-nexus-black/80 p-8 font-mono text-sm text-nexus-light leading-relaxed">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-sans font-bold text-white mb-6 pb-2 border-b border-nexus-gray">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-sans font-bold text-white mt-8 mb-4">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-sans font-bold text-nexus-light mt-6 mb-3">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => <p className="mb-4 text-nexus-light/90">{children}</p>,
                    ul: ({ children }) => (
                      <ul className="list-none mb-4 space-y-2 pl-0">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-4 space-y-2 text-nexus-light/90">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="pl-4 border-l-2 border-nexus-purple/30 mb-2 text-nexus-light/90">
                        {children}
                      </li>
                    ),
                    a: ({ href, children }) => {
                      if (href?.startsWith('/')) {
                        return (
                          <Link
                            href={href}
                            className="text-nexus-purple hover:text-nexus-neon underline underline-offset-2"
                          >
                            {children}
                          </Link>
                        );
                      }
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-nexus-purple hover:text-nexus-neon underline underline-offset-2"
                        >
                          {children}
                        </a>
                      );
                    },
                    code: ({ className, children, ...props }) => {
                      const isBlock = className?.includes('language-');
                      if (isBlock) {
                        return (
                          <pre className="bg-nexus-dark border border-nexus-gray p-4 overflow-x-auto mb-4 text-xs text-nexus-light">
                            <code {...props}>{children}</code>
                          </pre>
                        );
                      }
                      return (
                        <code
                          className="bg-nexus-gray/50 border border-nexus-gray/50 px-1.5 py-0.5 text-nexus-accent"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children }) => <>{children}</>,
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-4 border border-nexus-gray">
                        <table className="w-full text-left border-collapse">{children}</table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-nexus-dark border-b border-nexus-gray">{children}</thead>
                    ),
                    th: ({ children }) => (
                      <th className="px-4 py-2 text-nexus-purple font-bold text-xs uppercase tracking-wider">
                        {children}
                      </th>
                    ),
                    tbody: ({ children }) => (
                      <tbody className="text-nexus-light/80">{children}</tbody>
                    ),
                    tr: ({ children }) => (
                      <tr className="border-b border-nexus-gray/50 hover:bg-nexus-gray/10">
                        {children}
                      </tr>
                    ),
                    td: ({ children }) => <td className="px-4 py-2">{children}</td>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-nexus-purple pl-4 py-1 my-4 text-nexus-muted italic">
                        {children}
                      </blockquote>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold text-white">{children}</strong>
                    ),
                  }}
                >
                  {content}
                </ReactMarkdown>
              </article>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
