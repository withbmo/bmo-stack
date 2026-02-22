'use client';

import 'xterm/css/xterm.css';

import { ArrowLeft, Plug, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import { useAuth } from '@/shared/auth';
import { DashboardPageHeader, PageLayout } from '@/shared/components/layout';
import { getApiErrorMessage } from '@/shared/lib';
import {
  appendTerminalTranscript,
  createTerminalSession,
  createTerminalTab,
  deleteTerminalTab,
  getTerminalTab,
  listTerminalTabs,
  type TerminalTabDetail,
  type TerminalTabSummary,
  updateTerminalTab,
} from '@/shared/lib/environments';

interface EnvironmentTerminalRouteProps {
  envId: string;
}

export const EnvironmentTerminalRoute = ({ envId }: EnvironmentTerminalRouteProps) => {
  const router = useRouter();
  const { user, hydrated } = useAuth();
  const [tabs, setTabs] = useState<TerminalTabSummary[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TerminalTabDetail | null>(null);
  const [tabsLoading, setTabsLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [ssmReady, setSsmReady] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const termInputDisposeRef = useRef<null | (() => void)>(null);
  const autoConnectStartedRef = useRef(false);
  const seqRef = useRef(0);
  const pendingDeltaRef = useRef('');
  const flushTimerRef = useRef<number | null>(null);
  const flushingRef = useRef(false);

  const title = useMemo(() => `ENV TERMINAL ${envId.slice(0, 8)}`.toUpperCase(), [envId]);

  const writeSystemLine = useCallback((line: string) => {
    const term = termRef.current;
    if (!term) return;
    term.writeln(`\r\n\x1b[90m[terminal]\x1b[0m ${line}`);
  }, []);

  const resetTerminalToTranscript = useCallback((transcript: string) => {
    const term = termRef.current;
    if (!term) return;
    try {
      term.reset();
      if (transcript) term.write(transcript);
    } catch {
      // Ignore xterm disposal race.
    }
  }, []);

  const flushTranscript = useCallback(
    async (tabId: string) => {
      if (flushingRef.current) return;
      let delta = pendingDeltaRef.current;
      if (!delta) return;

      flushingRef.current = true;
      pendingDeltaRef.current = '';
      const maxChunkChars = 8000;

      try {
        while (delta.length > 0) {
          const chunk = delta.slice(0, maxChunkChars);
          delta = delta.slice(maxChunkChars);

          const nextSeq = seqRef.current + 1;
          try {
            await appendTerminalTranscript(undefined, envId, tabId, { delta: chunk, seq: nextSeq });
            seqRef.current = nextSeq;
          } catch {
            delta = chunk + delta;
            throw new Error('append_failed');
          }
        }
      } catch {
        // Put unsent data back so we retry on next flush.
        pendingDeltaRef.current = delta + pendingDeltaRef.current;
      } finally {
        flushingRef.current = false;
      }
    },
    [envId]
  );

  useEffect(() => {
    if (!containerRef.current || termRef.current) return;

    let disposed = false;
    let rafId: number | null = null;
    const schedule = (fn: () => void) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (disposed) return;
        try {
          fn();
        } catch {
          // Ignore render/layout race conditions during mount/unmount (e.g. StrictMode double-invoke).
        }
      });
    };

    const term = new Terminal({
      convertEol: true,
      cursorBlink: true,
      fontFamily:
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      fontSize: 12,
      theme: { background: '#000000' },
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    const container = containerRef.current;

    // Defer open/fit to avoid xterm measuring while layout is unstable.
    schedule(() => {
      if (!container.isConnected) return;
      term.open(container);
      schedule(() => {
        fit.fit();
        term.focus();
      });
    });

    termRef.current = term;
    fitRef.current = fit;

    const ro = new ResizeObserver(() => schedule(() => fit.fit()));
    ro.observe(container);

    return () => {
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      try {
        term.dispose();
      } finally {
        termRef.current = null;
        fitRef.current = null;
      }
    };
  }, []);

  const connect = useCallback(async (tabId: string) => {
    if (!hydrated || !user || connecting || connected) return;
    setConnecting(true);
    setSsmReady(false);

    try {
      const session = await createTerminalSession(undefined, envId, tabId);
      const ws = new WebSocket(`${session.wsUrl}?token=${encodeURIComponent(session.token)}`);

      ws.onopen = () => {
        setConnected(true);
        termRef.current?.focus();
      };
      ws.onmessage = event => {
        if (typeof event.data !== 'string') return;

        // terminal-gateway sends a few JSON control messages (ok/error). Everything else is raw terminal output (ANSI).
        if (event.data.startsWith('{')) {
          try {
            const parsed = JSON.parse(event.data) as {
              ok?: boolean;
              message?: string;
              error?: string;
            };
            if (parsed?.ok && parsed?.message === 'Terminal session established') {
              setSsmReady(true);
            }
            if (parsed?.error) writeSystemLine(parsed.error);
            return;
          } catch {
            // Fall through and treat it as terminal output.
          }
        }

        termRef.current?.write(event.data);

        pendingDeltaRef.current += event.data;
        if (pendingDeltaRef.current.length >= 4096) {
          void flushTranscript(tabId);
        } else if (!flushTimerRef.current) {
          flushTimerRef.current = window.setTimeout(() => {
            flushTimerRef.current = null;
            void flushTranscript(tabId);
          }, 1000);
        }
      };
      ws.onclose = () => {
        setConnected(false);
        setSsmReady(false);
        setSocket(null);
      };
      ws.onerror = () => {
        writeSystemLine('Connection error');
      };

      // Send user keystrokes to the gateway (which forwards to SSM).
      termInputDisposeRef.current?.();
      const disposable = termRef.current?.onData(data => {
        if (ws.readyState === WebSocket.OPEN) ws.send(data);
      });
      termInputDisposeRef.current = disposable ? () => disposable.dispose() : null;

      setSocket(ws);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to connect');
      writeSystemLine(message);
    } finally {
      setConnecting(false);
    }
  }, [connected, connecting, envId, flushTranscript, hydrated, user, writeSystemLine]);

  const disconnect = useCallback(() => {
    termInputDisposeRef.current?.();
    termInputDisposeRef.current = null;
    if (flushTimerRef.current) window.clearTimeout(flushTimerRef.current);
    flushTimerRef.current = null;
    socket?.close();
    setConnected(false);
    setSsmReady(false);
    setSocket(null);
  }, [socket]);

  const refreshTabs = useCallback(async () => {
    if (!hydrated || !user) return;
    setTabsLoading(true);
    try {
      const t = await listTerminalTabs(undefined, envId);
      setTabs(t);
      return t;
    } finally {
      setTabsLoading(false);
    }
  }, [envId, hydrated, user]);

  const ensureInitialTab = useCallback(async () => {
    if (!hydrated || !user) return;
    const current = await refreshTabs();
    if (!current) return;

    let active = current.find((x) => x.isActive) ?? current[0] ?? null;
    if (!active) {
      active = await createTerminalTab(undefined, envId);
      setTabs([active]);
    }

    setActiveTabId(active.id);
    if (!active.isActive) {
      await updateTerminalTab(undefined, envId, active.id, { isActive: true });
      void refreshTabs();
    }

    const detail = await getTerminalTab(undefined, envId, active.id);
    setActiveTab(detail);
    seqRef.current = detail.lastSeq || 0;
    resetTerminalToTranscript(detail.transcript);
    await connect(active.id);
  }, [connect, envId, hydrated, refreshTabs, resetTerminalToTranscript, user]);

  useEffect(() => {
    if (!hydrated || !user) return;
    if (autoConnectStartedRef.current) return;
    autoConnectStartedRef.current = true;
    void ensureInitialTab().catch((err) => {
      writeSystemLine(getApiErrorMessage(err, 'Failed to load terminal tabs'));
    });
  }, [ensureInitialTab, hydrated, user, writeSystemLine]);

  useEffect(() => {
    return () => {
      if (activeTabId) void flushTranscript(activeTabId);
      if (flushTimerRef.current) window.clearTimeout(flushTimerRef.current);
      flushTimerRef.current = null;
      termInputDisposeRef.current?.();
      termInputDisposeRef.current = null;
      socket?.close();
    };
  }, [activeTabId, flushTranscript, socket]);

  const switchToTab = useCallback(
    async (tabId: string) => {
      if (tabId === activeTabId) return;

      if (activeTabId) await flushTranscript(activeTabId);
      disconnect();

      setActiveTabId(tabId);
      await updateTerminalTab(undefined, envId, tabId, { isActive: true });
      void refreshTabs();

      const detail = await getTerminalTab(undefined, envId, tabId);
      setActiveTab(detail);
      seqRef.current = detail.lastSeq || 0;
      pendingDeltaRef.current = '';
      resetTerminalToTranscript(detail.transcript);
      await connect(tabId);
    },
    [activeTabId, connect, disconnect, envId, flushTranscript, refreshTabs, resetTerminalToTranscript]
  );

  const addTab = useCallback(async () => {
    const created = await createTerminalTab(undefined, envId);
    void refreshTabs();
    await switchToTab(created.id);
  }, [envId, refreshTabs, switchToTab]);

  const renameTab = useCallback(
    async (tabId: string) => {
      const current = tabs.find((t) => t.id === tabId);
      const next = window.prompt('Tab name', current?.title ?? '');
      if (!next) return;
      await updateTerminalTab(undefined, envId, tabId, { title: next });
      void refreshTabs();
      if (tabId === activeTabId) {
        setActiveTab((prev) => (prev ? { ...prev, title: next } : prev));
      }
    },
    [activeTabId, envId, refreshTabs, tabs]
  );

  const closeTab = useCallback(
    async (tabId: string) => {
      await deleteTerminalTab(undefined, envId, tabId);
      const nextTabs = await refreshTabs();

      if (tabId !== activeTabId) return;

      const fallback = nextTabs?.find((t) => t.id !== tabId) ?? null;
      if (fallback) {
        await switchToTab(fallback.id);
      } else {
        await addTab();
      }
    },
    [activeTabId, addTab, envId, refreshTabs, switchToTab]
  );

  const toggleTmux = useCallback(
    async (enabled: boolean) => {
      if (!activeTabId) return;
      await updateTerminalTab(undefined, envId, activeTabId, { tmuxEnabled: enabled, isActive: true });
      const detail = await getTerminalTab(undefined, envId, activeTabId);
      setActiveTab(detail);
      void refreshTabs();

      await flushTranscript(activeTabId);
      disconnect();
      pendingDeltaRef.current = '';
      await connect(activeTabId);
    },
    [activeTabId, connect, disconnect, envId, flushTranscript, refreshTabs]
  );

  return (
    <PageLayout className="pb-8">
      <DashboardPageHeader
        badge={{ icon: Plug, label: 'TERMINAL' }}
        title={<>{title}</>}
        subtitle="Dedicated VM terminal. Owner-only short-lived session tokens are required."
        actions={
          <button
            onClick={() => router.push('/dashboard/environments')}
            className="text-xs font-mono text-nexus-muted hover:text-white flex items-center gap-2 transition-colors"
          >
            <ArrowLeft size={14} /> BACK TO ENVIRONMENTS
          </button>
        }
      />

      <div className="border border-border-dim bg-black min-h-[480px] flex flex-col">
        <div className="flex items-center justify-between gap-3 px-3 py-2 border-b border-border-dim bg-black">
          <div className="flex items-center gap-2 overflow-x-auto">
            {tabs.map((t) => (
              <div
                key={t.id}
                className={`flex items-center gap-2 px-2 py-1 text-xs font-mono border transition-colors ${
                  t.id === activeTabId
                    ? 'text-white border-white/30 bg-white/10'
                    : 'text-white/70 border-border-dim hover:border-white/20 hover:text-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => void switchToTab(t.id)}
                  onDoubleClick={() => void renameTab(t.id)}
                  className="whitespace-nowrap"
                  title={t.title}
                >
                  {t.title}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    void closeTab(t.id);
                  }}
                  className="text-white/50 hover:text-white"
                  title="Close tab"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => void addTab()}
              className="flex items-center gap-1 px-2 py-1 text-xs font-mono border border-border-dim text-white/80 hover:text-white hover:border-white/20 transition-colors"
              title="New tab"
              disabled={tabsLoading}
            >
              <Plus size={12} /> New
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs font-mono text-white/80 select-none">
            <input
              type="checkbox"
              checked={activeTab?.tmuxEnabled ?? false}
              onChange={(e) => void toggleTmux(e.target.checked)}
              disabled={!activeTabId}
            />
            Persistent (tmux)
          </label>
        </div>

        <div className="flex-1 p-3">
          <div className="relative h-[640px] w-full">
            <div ref={containerRef} className="h-full w-full" aria-label="Terminal" />
            {(connecting || (connected && !ssmReady)) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <div className="flex items-center gap-3 rounded-md border border-border-dim bg-black/70 px-4 py-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <div className="text-xs font-mono text-white/80">
                    Starting Terminal...
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
