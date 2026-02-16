import type { HubResource } from '@/shared/types';

export const HUB_RESOURCES: HubResource[] = [
  {
    id: 'h1',
    type: 'readme',
    title: 'Production FastAPI Boilerplate',
    description:
      'The definitive guide to structuring async python APIs for 2024. Includes Docker, Celery, and Redis patterns that LLMs usually get wrong.',
    author: 'seniordev_01',
    stars: 2400,
    forks: 430,
    tags: ['python', 'fastapi', 'architecture'],
    updatedAt: '2h ago',
    verified: true,
  },
  {
    id: 'h2',
    type: 'skill',
    title: 'Distributed Systems Mastery',
    description:
      'A skill tree roadmap for understanding eventual consistency, sharding strategies, and CAP theorem in practice.',
    author: 'system_arch',
    stars: 1800,
    forks: 200,
    tags: ['system-design', 'backend', 'roadmap'],
    updatedAt: '1d ago',
    verified: true,
  },
  {
    id: 'h3',
    type: 'readme',
    title: 'React 19 Server Components - The Right Way',
    description:
      'Stop using client components everywhere. This repo demonstrates optimal streaming patterns and suspense boundaries.',
    author: 'frontend_wiz',
    stars: 890,
    forks: 120,
    tags: ['react', 'nextjs', 'performance'],
    updatedAt: '4h ago',
  },
  {
    id: 'h4',
    type: 'skill',
    title: 'Prompt Engineering v4: Context Windows',
    description:
      'Advanced techniques for managing large context windows and preventing hallucination in RAG pipelines.',
    author: 'ai_researcher',
    stars: 3100,
    forks: 890,
    tags: ['ai', 'llm', 'rag'],
    updatedAt: '12m ago',
    verified: true,
  },
  {
    id: 'h5',
    type: 'readme',
    title: 'Kubernetes Operator Pattern in Go',
    description:
      "Best practices for writing custom controllers. Don't rely on generated boilerplate.",
    author: 'k8s_guru',
    stars: 500,
    forks: 45,
    tags: ['go', 'k8s', 'devops'],
    updatedAt: '3d ago',
  },
  {
    id: 'h6',
    type: 'skill',
    title: 'Rust Memory Safety Deep Dive',
    description: 'Understanding lifetimes and borrowing for C++ developers migrating to Rust.',
    author: 'rustacean',
    stars: 1200,
    forks: 150,
    tags: ['rust', 'low-level', 'safety'],
    updatedAt: '1w ago',
  },
];
