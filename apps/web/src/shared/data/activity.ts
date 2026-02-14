import type { ActivityLog } from '@/shared/types';

export const ACTIVITY_LOGS: ActivityLog[] = [
  { id: '1', message: 'System initialized', timestamp: '00:00:01', type: 'success' },
  { id: '2', message: 'Loading project manifest...', timestamp: '00:00:02', type: 'info' },
  { id: '3', message: 'Connected to deployment API', timestamp: '00:00:03', type: 'success' },
  { id: '4', message: 'Health check passed', timestamp: '00:00:04', type: 'info' },
  { id: '5', message: 'Cache warmed', timestamp: '00:00:05', type: 'success' },
  { id: '6', message: 'Ready for requests', timestamp: '00:00:06', type: 'info' },
];
