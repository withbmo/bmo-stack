import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import jwt from 'jsonwebtoken';

const app = Fastify({ logger: true });

type TerminalClaims = {
  typ: 'terminal_session';
  sub: string;
  envId: string;
  nonce: string;
  exp?: number;
};

function tokenSecret(): string {
  const secret = process.env.ENV_SESSION_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('ENV_SESSION_SECRET (or JWT_SECRET) must be set');
  }
  return secret;
}

function verifyTerminalToken(token: string): TerminalClaims {
  const decoded = jwt.verify(token, tokenSecret()) as TerminalClaims;
  if (decoded.typ !== 'terminal_session') {
    throw new Error('Invalid token type');
  }
  return decoded;
}

async function bootstrap() {
  await app.register(helmet);
  await app.register(cors, { origin: true });
  await app.register(websocket);

  app.get('/health', async () => ({ status: 'ok', service: 'terminal-gateway' }));

  app.get('/ws', { websocket: true }, (socket, request) => {
    const token = (request.query as Record<string, string | undefined>)?.token;

    if (!token) {
      socket.close(1008, 'Missing session token');
      return;
    }

    let claims: TerminalClaims;
    try {
      claims = verifyTerminalToken(token);
    } catch {
      socket.close(1008, 'Invalid or expired session token');
      return;
    }

    socket.send(
      JSON.stringify({
        ok: true,
        message: 'Terminal session accepted',
        userId: claims.sub,
        envId: claims.envId,
      })
    );

    socket.on('message', (message: Buffer) => {
      const text = message.toString();
      socket.send(`echo: ${text}`);
    });
  });

  const port = Number(process.env.PORT || 3403);
  await app.listen({ port, host: '0.0.0.0' });
}

void bootstrap();
