import { Activity, Clock, Server } from 'lucide-react';
import { useEffect, useState } from 'react';

export const SystemMonitor = () => {
  const [stats, setStats] = useState({
    cpu: 12,
    memory: 450,
    history: Array(40).fill(10),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => {
        const newCpu = Math.floor(Math.random() * 30) + 10;
        return {
          cpu: newCpu,
          memory: Math.min(
            2048,
            Math.max(400, prev.memory + Math.floor(Math.random() * 20) - 10)
          ),
          history: [...prev.history.slice(1), newCpu],
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full w-full min-w-0 flex-col space-y-6 overflow-hidden bg-bg-app p-6 animate-in fade-in duration-300">
      <div className="flex items-end justify-between border-b border-border-default pb-4">
        <div>
          <h2 className="mb-1 font-sans text-2xl font-bold text-white">
            SYSTEM_DIAGNOSTICS
          </h2>
          <div className="flex gap-4 font-mono text-[10px] text-text-muted">
            <span className="flex items-center gap-1">
              <Server size={10} /> CONTAINER_ID: 8f921a
            </span>
            <span className="flex items-center gap-1">
              <Clock size={10} /> UPTIME: 4d 12h 30m
            </span>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 border border-brand-accent/30 bg-brand-accent/10 px-3 py-1 font-mono text-xs text-brand-accent animate-pulse">
          <Activity size={12} /> HEALTHY
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="border border-border-default bg-bg-panel p-4">
          <div className="mb-2 font-mono text-[10px] text-text-muted">
            CPU_LOAD
          </div>
          <div className="font-mono text-3xl font-bold text-brand-primary">
            {stats.cpu}%
          </div>
        </div>
        <div className="border border-border-default bg-bg-panel p-4">
          <div className="mb-2 font-mono text-[10px] text-text-muted">
            MEMORY
          </div>
          <div className="text-3xl font-mono font-bold text-white">
            {stats.memory}MB
          </div>
        </div>
        <div className="border border-border-default bg-bg-panel p-4">
          <div className="mb-2 font-mono text-[10px] text-text-muted">
            NETWORK
          </div>
          <div className="text-3xl font-mono font-bold text-blue-400">
            3.5MB/s
          </div>
        </div>
        <div className="border border-border-default bg-bg-panel p-4">
          <div className="mb-2 font-mono text-[10px] text-text-muted">
            DISK
          </div>
          <div className="font-mono text-3xl font-bold text-brand-accent">
            42%
          </div>
        </div>
      </div>

      <div className="flex-1 border border-border-default bg-bg-panel p-4">
        <div className="mb-4 font-mono text-xs text-text-muted">
          PROCESS_LIST
        </div>
        <div className="space-y-2 font-mono text-[10px]">
          {[
            { pid: 1402, cmd: 'python main.py', cpu: stats.cpu },
            { pid: 89, cmd: '/usr/bin/monitor', cpu: 1.2 },
            { pid: 22, cmd: 'postgres: checkpointer', cpu: 0.5 },
          ].map((p) => (
            <div key={p.pid} className="flex gap-4 text-text-secondary/80">
              <span className="w-12 text-brand-accent">{p.pid}</span>
              <span className="w-16">{p.cpu}%</span>
              <span className="flex-1 truncate">{p.cmd}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
