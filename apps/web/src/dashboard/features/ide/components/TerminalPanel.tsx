import { useState } from 'react';
import { useAuth } from '@/shared/auth';
import { createTerminalSession } from '@/shared/lib/environments';

interface TerminalPanelProps {
  environmentId?: string;
}

const initialLogs = ['> Terminal initialized. Connect to start VM shell session.'];

export const TerminalPanel = ({ environmentId }: TerminalPanelProps) => {
  const { token } = useAuth();
  const [terminalLogs, setTerminalLogs] = useState<string[]>(initialLogs);
  const [terminalInput, setTerminalInput] = useState('');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const appendLog = (line: string) => {
    setTerminalLogs((prev) => [...prev, line]);
  };

  const connect = async () => {
    if (!token || !environmentId || connecting || connected) return;

    setConnecting(true);
    try {
      const session = await createTerminalSession(token, environmentId);
      const ws = new WebSocket(`${session.wsUrl}?token=${encodeURIComponent(session.token)}`);
      ws.onopen = () => {
        setConnected(true);
        appendLog('> Connected to terminal gateway');
      };
      ws.onmessage = (event) => {
        appendLog(typeof event.data === 'string' ? event.data : '[binary message]');
      };
      ws.onerror = () => appendLog('> Terminal connection error');
      ws.onclose = () => {
        setConnected(false);
        setSocket(null);
        appendLog('> Terminal disconnected');
      };

      setSocket(ws);
    } catch (error) {
      appendLog(`> ${error instanceof Error ? error.message : 'Connection failed'}`);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    socket?.close();
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;
    appendLog(`$ ${terminalInput}`);
    socket?.send(terminalInput);
    setTerminalInput('');
  };

  return (
    <div className="h-1/3 border-t border-nexus-gray flex flex-col bg-black">
      <div className="flex items-center justify-between px-4 py-2 bg-[#080808] border-b border-nexus-gray/30">
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono font-bold text-white border-b border-nexus-purple pb-0.5">
            TERMINAL
          </span>
          <span className="text-xs font-mono text-nexus-muted">
            {connected ? 'CONNECTED' : 'DISCONNECTED'}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={connect}
            disabled={!environmentId || connecting || connected}
            className="text-[10px] font-mono border border-nexus-gray px-2 py-1 text-white disabled:opacity-40"
          >
            {connecting ? 'CONNECTING' : 'CONNECT'}
          </button>
          <button
            type="button"
            onClick={disconnect}
            disabled={!connected}
            className="text-[10px] font-mono border border-nexus-gray px-2 py-1 text-white disabled:opacity-40"
          >
            DISCONNECT
          </button>
        </div>
      </div>
      <div
        className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-1 text-nexus-light/80"
        onClick={() => document.getElementById('term-input')?.focus()}
      >
        {terminalLogs.map((log, i) => (
          <div key={`${log}-${i}`}>{log}</div>
        ))}
        <form onSubmit={handleTerminalSubmit} className="flex gap-2 mt-2">
          <span className="text-nexus-accent">$</span>
          <input
            id="term-input"
            type="text"
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0"
            autoComplete="off"
            disabled={!connected}
            placeholder={connected ? 'Run command...' : 'Connect terminal session first'}
          />
        </form>
      </div>
    </div>
  );
};
