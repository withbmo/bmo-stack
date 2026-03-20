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
    <div className="relative min-h-screen px-6 pb-20 pt-28">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <BackgroundLayers />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex gap-12">
          <aside className="hidden w-56 shrink-0 border-r border-border-default pr-6 md:block">
            <div className="mb-6 flex w-fit items-center gap-2 border border-brand-primary/50 bg-brand-primary/10 px-3 py-1 font-mono text-xs tracking-widest text-brand-primary">
              <BookOpen size={12} /> DOCS
            </div>

            <nav className="space-y-0.5">
              {manifest.map(doc => (
                <Link
                  key={doc.slug}
                  href={`/docs/${doc.slug}`}
                  className={`flex items-center gap-2 border-l-2 px-3 py-2 font-mono text-sm transition-colors ${
                    activeSlug === doc.slug
                      ? 'border-brand-primary bg-brand-primary/10 text-text-primary'
                      : 'border-transparent text-text-muted hover:border-border-default hover:bg-border-default/10 hover:text-text-primary'
                  }`}
                >
                  <FileText size={14} />
                  {doc.title}
                </Link>
              ))}
            </nav>
          </aside>

          <main className="min-w-0 max-w-3xl flex-1">
            {error && (
              <div className="border border-border-default bg-bg-panel/50 p-6 font-mono text-text-muted">
                {error}.{' '}
                <Link href="/docs" className="text-brand-primary hover:underline">
                  Back to docs
                </Link>
                .
              </div>
            )}

            {loading && !content && !error && (
              <div className="font-mono text-text-muted animate-pulse">Loading...</div>
            )}

            {content && !error && (
              <article className="docs-content border border-border-default bg-bg-app/80 p-8 font-mono text-sm leading-relaxed text-text-secondary">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="mb-6 border-b border-border-default pb-2 font-sans text-3xl font-bold text-text-primary">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="mb-4 mt-8 font-sans text-xl font-bold text-text-primary">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="mb-3 mt-6 font-sans text-lg font-bold text-text-secondary">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => <p className="mb-4 text-text-secondary/90">{children}</p>,
                    ul: ({ children }) => (
                      <ul className="list-none mb-4 space-y-2 pl-0">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-4 list-decimal list-inside space-y-2 text-text-secondary/90">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="mb-2 border-l-2 border-brand-primary/30 pl-4 text-text-secondary/90">
                        {children}
                      </li>
                    ),
                    a: ({ href, children }) => {
                      if (href?.startsWith('/')) {
                        return (
                          <Link
                            href={href}
                            className="text-brand-primary underline underline-offset-2 hover:text-brand-neon"
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
                          className="text-brand-primary underline underline-offset-2 hover:text-brand-neon"
                        >
                          {children}
                        </a>
                      );
                    },
                    code: ({ className, children, ...props }) => {
                      const isBlock = className?.includes('language-');
                      if (isBlock) {
                        return (
                          <pre className="mb-4 overflow-x-auto border border-border-default bg-bg-panel p-4 text-xs text-text-secondary">
                            <code {...props}>{children}</code>
                          </pre>
                        );
                      }
                      return (
                        <code
                          className="border border-border-default/50 bg-border-default/30 px-1.5 py-0.5 text-brand-accent"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children }) => <>{children}</>,
                    table: ({ children }) => (
                      <div className="mb-4 overflow-x-auto border border-border-default">
                        <table className="w-full text-left border-collapse">{children}</table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="border-b border-border-default bg-bg-panel">{children}</thead>
                    ),
                    th: ({ children }) => (
                      <th className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-brand-primary">
                        {children}
                      </th>
                    ),
                    tbody: ({ children }) => (
                      <tbody className="text-text-secondary/80">{children}</tbody>
                    ),
                    tr: ({ children }) => (
                      <tr className="border-b border-border-default/50 hover:bg-border-default/10">
                        {children}
                      </tr>
                    ),
                    td: ({ children }) => <td className="px-4 py-2">{children}</td>,
                    blockquote: ({ children }) => (
                      <blockquote className="my-4 border-l-2 border-brand-primary py-1 pl-4 italic text-text-muted">
                        {children}
                      </blockquote>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold text-text-primary">{children}</strong>
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
