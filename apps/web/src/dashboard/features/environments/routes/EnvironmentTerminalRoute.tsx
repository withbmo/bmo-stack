'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plug, PlugZap } from 'lucide-react';
import { Button } from '@/dashboard/components';
import { PageLayout, DashboardPageHeader } from '@/shared/components/layout';
import { useAuth } from '@/shared/auth';
import { createTerminalSession } from '@/shared/lib/environments';

interface EnvironmentTerminalRouteProps {
  envId: string;
}

export const EnvironmentTerminalRoute = ({ envId }: EnvironmentTerminalRouteProps) => {
  const router = useRouter();
  const { token } = useAuth();
  const [logs, setLogs] = useState<string[]>(['> Terminal ready']);
  const [input, setInput] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const title = useMemo(() => `ENV TERMINAL ${envId.slice(0, 8)}`.toUpperCase(), [envId]);

  const appendLog = (line: string) => {
    setLogs((prev) => [...prev, line]);
  };

  const connect = async () => {
    if (!token || connecting || connected) return;
    setConnecting(true);

    try {
      const session = await createTerminalSession(token, envId);
      const ws = new WebSocket(`${session.wsUrl}?token=${encodeURIComponent(session.token)}`);

      ws.onopen = () => {
        appendLog('> Connected to terminal gateway');
        setConnected(true);
      };
      ws.onmessage = (event) => {
        appendLog(typeof event.data === 'string' ? event.data : '[binary message]');
      };
      ws.onclose = () => {
        appendLog('> Session closed');
        setConnected(false);
        setSocket(null);
      };
      ws.onerror = () => {
        appendLog('> Connection error');
      };

      setSocket(ws);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect';
      appendLog(`> ${message}`);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    socket?.close();
  };

  const sendInput = (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;

    appendLog(`$ ${input}`);
    socket?.send(input);
    setInput('');
  };

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
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-dim">
          <div className="text-xs font-mono text-text-secondary">Connection status: {connected ? 'connected' : 'disconnected'}</div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={connect} disabled={connecting || connected}>
              <PlugZap size={14} /> {connecting ? 'CONNECTING...' : 'CONNECT'}
            </Button>
            <Button size="sm" variant="danger" onClick={disconnect} disabled={!connected}>
              DISCONNECT
            </Button>
          </div>
        </div>

        <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1 text-nexus-light/90">
          {logs.map((line, index) => (
            <div key={`${line}-${index}`}>{line}</div>
          ))}
        </div>

        <form onSubmit={sendInput} className="border-t border-border-dim p-3 flex items-center gap-2">
          <span className="text-nexus-accent font-mono">$</span>
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={!connected}
            className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs"
            placeholder={connected ? 'Type command...' : 'Connect first'}
          />
          <Button size="sm" variant="primary" disabled={!connected || !input.trim()}>
            SEND
          </Button>
        </form>
      </div>
    </PageLayout>
  );
};
