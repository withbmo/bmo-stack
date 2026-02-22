import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import websocket from '@fastify/websocket';
import Fastify from 'fastify';
import WebSocket from 'ws';

import { verifyTerminalToken } from './auth';
import { port, requireSessionSecret } from './config';
import { startSsmShellSession } from './ssm/session';

const app = Fastify({ logger: true });

app.register(cors, {
  origin: true,
  credentials: true,
});
app.register(helmet);
app.register(websocket);

app.register(async function routes(fastify) {
  fastify.get('/health', async () => ({ ok: true }));

  // Keep websocket routes inside an encapsulated plugin to ensure
  // @fastify/websocket's onRoute hook is applied consistently.
  fastify.get('/ws', { websocket: true }, async (socket, request) => {
    const token = (request.query as Record<string, string | undefined>)?.token;
    if (!token) {
      socket.close(1008, 'Missing session token');
      return;
    }

    let claims;
    try {
      claims = verifyTerminalToken(token, requireSessionSecret());
    } catch {
      app.log.warn({ tokenLen: token.length }, 'Invalid or expired session token');
      socket.close(1008, 'Invalid or expired session token');
      return;
    }

    let ssmWs: WebSocket | null = null;
    let sendInput: ((data: string) => void) | null = null;
    let terminate: (() => Promise<void>) | null = null;

    try {
      const tmuxEnabled = claims.tmuxEnabled === true;
      const tmuxNameRaw = typeof claims.tmuxSessionName === 'string' ? claims.tmuxSessionName : '';
      const tmuxName =
        tmuxEnabled && /^[a-zA-Z0-9_.-]{1,64}$/.test(tmuxNameRaw) ? tmuxNameRaw : null;

      const command = tmuxName
        ? `bash -lc 'command -v tmux >/dev/null 2>&1 && exec tmux new -A -s ${tmuxName} || exec bash'`
        : '/bin/bash';

      const session = await startSsmShellSession({
        instanceId: claims.instanceId,
        region: claims.region,
        command,
        onEstablished: () => {
          socket.send(JSON.stringify({ ok: true, message: 'Terminal session established' }));
        },
        onOutput: chunk => socket.send(chunk),
        onClosedByRemote: () => {
          socket.send('> Session closed by remote host');
          socket.close(1000, 'SSM channel closed');
        },
        onError: message => {
          socket.send(JSON.stringify({ error: message }));
          socket.close(1011, 'Terminal error');
        },
      });

      ssmWs = session.ssmWs;
      sendInput = session.sendInput;
      terminate = session.terminate;
    } catch (err) {
      app.log.error(
        { err, instanceId: claims.instanceId, region: claims.region },
        'SSM StartSession failed'
      );
      socket.send(JSON.stringify({ error: (err as Error).message }));
      socket.close(1011, 'SSM session start failed');
      return;
    }

    socket.on('message', (message: Buffer) => {
      sendInput?.(message.toString('utf8'));
    });

    socket.on('close', () => {
      if (
        ssmWs &&
        (ssmWs.readyState === WebSocket.OPEN || ssmWs.readyState === WebSocket.CONNECTING)
      ) {
        ssmWs.close();
      }
      void terminate?.().catch(() => {});
    });
  });
});

app.listen({ port: port(), host: '0.0.0.0' });
