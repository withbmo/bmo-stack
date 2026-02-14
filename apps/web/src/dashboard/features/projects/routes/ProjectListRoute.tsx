import { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import { PageLayout, DashboardPageHeader } from '@/shared/components/layout';
import { ACTIVITY_LOGS } from '@/shared/data/activity';
import type { ActivityLog } from '@/shared/types';
import { ProjectList } from '../components/ProjectList';

const ResourceTicker = ({
  label,
  value,
  unit,
  colorClass,
}: {
  label: string;
  value: number;
  unit: string;
  colorClass: string;
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const interval = setInterval(() => {
      const fluctuation = Math.floor(Math.random() * 5) - 2;
      setDisplayValue(v => Math.max(0, v + fluctuation));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col bg-bg-surface border border-nexus-gray p-3 min-w-[140px]">
      <span className="text-[10px] text-nexus-light/70 font-mono uppercase mb-1 tracking-wider">
        {label}
      </span>
      <div className={`text-2xl font-mono font-bold ${colorClass}`}>
        {displayValue}
        {unit}
      </div>
      <div className="w-full h-1 bg-nexus-gray/30 mt-2">
        <div
          className={`h-full ${colorClass.replace('text-', 'bg-')} transition-all duration-500`}
          style={{ width: `${Math.min(displayValue, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export const ProjectListRoute = () => {
  return (
    <PageLayout className="pb-12">
      {/* Dashboard Header / HUD */}
      <DashboardPageHeader
        badge={{ icon: Terminal, label: 'PROJECTS' }}
        title={
          <>
            <span className="text-nexus-muted">COMMAND</span> CENTER
          </>
        }
        subtitle="Create and manage your projects"
        actions={
          <div className="flex gap-4">
            <ResourceTicker label="CPU_LOAD" value={42} unit="%" colorClass="text-nexus-accent" />
            <ResourceTicker
              label="MEM_ALLOC"
              value={1.2}
              unit="GB"
              colorClass="text-nexus-purple"
            />
            <ResourceTicker label="NET_IO" value={340} unit="ms" colorClass="text-blue-400" />
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Projects */}
        <div className="lg:col-span-3 space-y-8">
          <ProjectList />
        </div>

        {/* Right Column: Activity & quick stats */}
        <div className="space-y-6">
          {/* Activity Log */}
          <div className="bg-bg-panel border border-nexus-gray p-0 overflow-hidden">
            <div className="bg-black/50 p-3 border-b border-nexus-gray flex justify-between items-center">
              <span className="font-mono text-[10px] uppercase text-nexus-muted tracking-wider">
                System Logs
              </span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-nexus-gray"></div>
                <div className="w-2 h-2 rounded-full bg-nexus-gray"></div>
              </div>
            </div>
            <div className="p-4 font-mono text-[10px] space-y-3 h-[300px] overflow-y-auto">
              {ACTIVITY_LOGS.map((log: ActivityLog) => (
                <div
                  key={log.id}
                  className="flex gap-2 opacity-80 hover:opacity-100 transition-opacity"
                >
                  <span className="text-nexus-muted whitespace-nowrap">[{log.timestamp}]</span>
                  <span
                    className={`${
                      log.type === 'success'
                        ? 'text-nexus-accent'
                        : log.type === 'warning'
                          ? 'text-yellow-400'
                          : log.type === 'error'
                            ? 'text-red-500'
                            : 'text-white'
                    }`}
                  >
                    {log.type === 'info' && '> '}
                    {log.message}
                  </span>
                </div>
              ))}
              <div className="animate-pulse text-nexus-purple">_</div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
