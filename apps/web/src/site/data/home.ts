import type { Stat } from '@/shared/types';

export const HERO_PYTHON_CODE = `class PytholitApp(App):
    def __init__(self):
        self.scale = "infinite"
        self.latency = 0
        self.deploy_mode = "instant"

    async def build_future(self):
        await self.disrupt_market()
        return "Legacy code destroyed."`;

export const WORKFLOW_STEPS = [
  {
    id: 's1',
    title: 'Describe the service',
    description:
      'Prompt the runtime or import a repo. We generate the scaffolding, config, and health checks.',
    meta: 'Prompt + Git import',
    icon: 'message',
  },
  {
    id: 's2',
    title: 'Run it instantly',
    description:
      'Spin up a container with observability baked in. Hot reload and live logs ship by default.',
    meta: 'Zero config runtime',
    icon: 'zap',
  },
  {
    id: 's3',
    title: 'Deploy with one command',
    description: 'Ship to global regions, add a custom domain, and monitor SLOs in one panel.',
    meta: 'Edge deploys',
    icon: 'rocket',
  },
];

export const STATS: Stat[] = [
  {
    label: 'RUNTIMES ACTIVE',
    value: '4.2M+',
    detail: 'Always-on environments across teams and projects.',
  },
  {
    label: 'LINES COMPILED',
    value: '89B',
    detail: 'Zero-downtime builds with live telemetry.',
  },
  {
    label: 'UPTIME',
    value: '99.99%',
    detail: 'Multi-region failover and auto-recovery.',
  },
];
