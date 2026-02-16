import { Activity,Clock, Server } from 'lucide-react';
import { useEffect,useState } from 'react';

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
    <div className="h-full w-full min-w-0 flex flex-col bg-[#0C0C0C] overflow-hidden animate-in fade-in duration-300 p-6 space-y-6">
      <div className="flex justify-between items-end border-b border-nexus-gray pb-4">
        <div>
          <h2 className="text-2xl font-sans font-bold text-white mb-1">
            SYSTEM_DIAGNOSTICS
          </h2>
          <div className="flex gap-4 font-mono text-[10px] text-nexus-muted">
            <span className="flex items-center gap-1">
              <Server size={10} /> CONTAINER_ID: 8f921a
            </span>
            <span className="flex items-center gap-1">
              <Clock size={10} /> UPTIME: 4d 12h 30m
            </span>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-nexus-accent/30 bg-nexus-accent/10 text-nexus-accent font-mono text-xs animate-pulse">
          <Activity size={12} /> HEALTHY
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#080808] border border-nexus-gray p-4">
          <div className="text-[10px] text-nexus-muted font-mono mb-2">
            CPU_LOAD
          </div>
          <div className="text-3xl font-mono font-bold text-nexus-purple">
            {stats.cpu}%
          </div>
        </div>
        <div className="bg-[#080808] border border-nexus-gray p-4">
          <div className="text-[10px] text-nexus-muted font-mono mb-2">
            MEMORY
          </div>
          <div className="text-3xl font-mono font-bold text-white">
            {stats.memory}MB
          </div>
        </div>
        <div className="bg-[#080808] border border-nexus-gray p-4">
          <div className="text-[10px] text-nexus-muted font-mono mb-2">
            NETWORK
          </div>
          <div className="text-3xl font-mono font-bold text-blue-400">
            3.5MB/s
          </div>
        </div>
        <div className="bg-[#080808] border border-nexus-gray p-4">
          <div className="text-[10px] text-nexus-muted font-mono mb-2">
            DISK
          </div>
          <div className="text-3xl font-mono font-bold text-nexus-accent">
            42%
          </div>
        </div>
      </div>

      <div className="flex-1 bg-[#080808] border border-nexus-gray p-4">
        <div className="font-mono text-xs text-nexus-muted mb-4">
          PROCESS_LIST
        </div>
        <div className="space-y-2 font-mono text-[10px]">
          {[
            { pid: 1402, cmd: 'python main.py', cpu: stats.cpu },
            { pid: 89, cmd: '/usr/bin/monitor', cpu: 1.2 },
            { pid: 22, cmd: 'postgres: checkpointer', cpu: 0.5 },
          ].map((p) => (
            <div key={p.pid} className="flex gap-4 text-nexus-light/80">
              <span className="text-nexus-accent w-12">{p.pid}</span>
              <span className="w-16">{p.cpu}%</span>
              <span className="flex-1 truncate">{p.cmd}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
