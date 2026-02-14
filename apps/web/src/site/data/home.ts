import type { Feature, Stat } from '@/shared/types';

export const HERO_PYTHON_CODE = `class PytholitApp(App):
    def __init__(self):
        self.scale = "infinite"
        self.latency = 0
        self.deploy_mode = "instant"

    async def build_future(self):
        await self.disrupt_market()
        return "Legacy code destroyed."`;

export const TRUSTED_STACK = [
  'FastAPI',
  'Django',
  'Flask',
  'Pydantic',
  'Celery',
  'PostgreSQL',
  'Redis',
  'LangChain',
];

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

export const FEATURES: Feature[] = [
  {
    id: 'f1',
    title: 'INSTANT RUNTIME',
    description: 'Zero-config environments with hot reload and deterministic builds.',
    pythonCode: 'env = Runtime.spawn(config="turbo")\nenv.boot()  # cold start: 28ms',
    icon: 'zap',
  },
  {
    id: 'f2',
    title: 'NEURAL CODEGEN',
    description: 'AI that plans before it codes. It ships clean scaffolds.',
    pythonCode: 'architect = PytholitAI.summon()\narchitect.plan("billing-api")',
    icon: 'cpu',
  },
  {
    id: 'f3',
    title: 'GLOBAL EDGE',
    description: 'Multi-region deploys with smart routing and edge caching.',
    pythonCode: 'app.deploy(region="global")\n# P95: 12ms',
    icon: 'cloud',
  },
  {
    id: 'f4',
    title: 'LIVE MULTIPLAYER',
    description: 'Pair on the same runtime with shared state and instant sync.',
    pythonCode: 'session = Collab.join(room_id="x9f2")\nsession.sync()',
    icon: 'users',
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
