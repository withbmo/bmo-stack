import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';

const app = Fastify({ logger: true });

async function bootstrap() {
  await app.register(helmet);
  await app.register(cors, { origin: true });

  app.get('/health', async () => ({ status: 'ok', service: 'env-orchestrator' }));

  app.post('/internal/environments/:id/start', async (request) => {
    const { id } = request.params as { id: string };
    return {
      ok: true,
      environmentId: id,
      state: 'starting',
      message: 'Orchestrator start accepted',
    };
  });

  app.post('/internal/environments/:id/stop', async (request) => {
    const { id } = request.params as { id: string };
    return {
      ok: true,
      environmentId: id,
      state: 'stopping',
      message: 'Orchestrator stop accepted',
    };
  });

  app.post('/internal/environments/:id/terminate', async (request) => {
    const { id } = request.params as { id: string };
    return {
      ok: true,
      environmentId: id,
      state: 'terminating',
      message: 'Orchestrator terminate accepted',
    };
  });

  app.get('/internal/environments/:id/status', async (request) => {
    const { id } = request.params as { id: string };
    return {
      environmentId: id,
      state: 'unknown',
      lastUpdated: new Date().toISOString(),
    };
  });

  const port = Number(process.env.PORT || 3401);
  await app.listen({ port, host: '0.0.0.0' });
}

void bootstrap();
