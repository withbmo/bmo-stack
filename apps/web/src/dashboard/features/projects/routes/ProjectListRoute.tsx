import { Terminal } from 'lucide-react';

import { Card, DashboardPageHeader, PageLayout } from '@/dashboard/components';
import { ACTIVITY_LOGS } from '@/shared/data/activity';
import type { ActivityLog } from '@/shared/types';

import { ProjectList } from '../components/ProjectList';

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
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Projects */}
        <div className="lg:col-span-3 space-y-8">
          <ProjectList />
        </div>

        {/* Right Column: Activity & quick stats */}
        <div className="space-y-6">
          {/* Activity Log */}
          <Card variant="default" padding="none" className="overflow-hidden bg-bg-panel">
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
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};
