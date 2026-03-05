'use client';

import 'xterm/css/xterm.css';

import { ArrowLeft, Plug } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import { Button, DashboardPageHeader, PageLayout } from '@/dashboard/components';
import { useAuth } from '@/shared/auth';
import { getApiErrorMessage } from '@/shared/lib';
import { createTerminalSession } from '@/shared/lib/environments';

interface EnvironmentTerminalRouteProps {
  envId: string;
}

export const EnvironmentTerminalRoute = ({ envId }: EnvironmentTerminalRouteProps) => {
  const router = useRouter();
  const { user, hydrated } = useAuth();
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [ssmReady, setSsmReady] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const termInputDisposeRef = useRef<null | (() => void)>(null);
  const autoConnectStartedRef = useRef(false);

  const title = useMemo(() => `ENV TERMINAL ${envId.slice(0, 8)}`.toUpperCase(), [envId]);

  const writeSystemLine = useCallback((line: string) => {
    const term = termRef.current;
    if (!term) return;
    term.writeln(`\r\n\x1b[90m[terminal]\x1b[0m ${line}`);
  }, []);

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
      theme: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#a855f7',
        cursorAccent: '#1e1e1e',
        selectionBackground: '#6d28d940',
        black: '#1e1e1e',
        brightBlack: '#3c3c3c',
        red: '#f87171',
        brightRed: '#fca5a5',
        green: '#4ec9b0',
        brightGreen: '#6ee7d4',
        yellow: '#fbbf24',
        brightYellow: '#fcd34d',
        blue: '#6d28d9',
        brightBlue: '#a855f7',
        magenta: '#a855f7',
        brightMagenta: '#c084fc',
        cyan: '#4ec9b0',
        brightCyan: '#6ee7d4',
        white: '#d4d4d4',
        brightWhite: '#f5f5f5',
      },
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

  const connect = useCallback(async () => {
    if (!hydrated || !user || connecting || connected) return;
    setConnecting(true);
    setSsmReady(false);

    try {
      const session = await createTerminalSession(undefined, envId);
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
  }, [connected, connecting, envId, hydrated, user, writeSystemLine]);

  const disconnect = useCallback(() => {
    termInputDisposeRef.current?.();
    termInputDisposeRef.current = null;
    socket?.close();
    setConnected(false);
    setSsmReady(false);
    setSocket(null);
  }, [socket]);

  useEffect(() => {
    if (!hydrated || !user) return;
    if (autoConnectStartedRef.current) return;
    autoConnectStartedRef.current = true;
    void connect().catch((err) => {
      writeSystemLine(getApiErrorMessage(err, 'Failed to connect to terminal'));
    });
  }, [connect, hydrated, user, writeSystemLine]);

  useEffect(() => {
    return () => {
      termInputDisposeRef.current?.();
      termInputDisposeRef.current = null;
      socket?.close();
    };
  }, [socket]);

  return (
    <PageLayout className="pb-8">
      <DashboardPageHeader
        badge={{ icon: Plug, label: 'TERMINAL' }}
        title={<>{title}</>}
        subtitle="Dedicated VM terminal. Owner-only short-lived session tokens are required."
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard/environments')}
              className="px-0 py-0 text-xs text-nexus-muted hover:text-white flex items-center gap-2"
            >
              <ArrowLeft size={14} /> BACK TO ENVIRONMENTS
            </Button>
            {connected ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={disconnect}
                className="text-xs"
              >
                Disconnect
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => void connect()}
                disabled={connecting}
                className="text-xs"
              >
                {connecting ? 'Connecting…' : 'Connect'}
              </Button>
            )}
          </div>
        }
      />

      <div className="border border-border-dim bg-nexus-black min-h-[480px] flex flex-col">
        <div className="flex-1 p-3">
          <div className="relative h-[640px] w-full">
            <div ref={containerRef} className="h-full w-full" aria-label="Terminal" />
            {(connecting || (connected && !ssmReady)) && (
              <div className="absolute inset-0 flex items-center justify-center bg-nexus-black/60">
                <div className="flex items-center gap-3 rounded-md border border-border-dim bg-nexus-dark/80 px-4 py-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-nexus-muted border-t-nexus-neon" />
                  <div className="text-xs font-mono text-nexus-light">
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
