import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import jwt from 'jsonwebtoken';

const app = Fastify({ logger: true });

type ProxySessionClaims = {
  typ: 'proxy_session';
  sub: string;
  envId: string;
  serviceKey?: string;
  exp?: number;
};

function tokenSecret(): string {
  const secret = process.env.ENV_SESSION_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('ENV_SESSION_SECRET (or JWT_SECRET) must be set');
  }
  return secret;
}

function parseBearerToken(header?: string): string | null {
  if (!header) return null;
  const [scheme, token] = header.split(' ');
  if (!scheme || !token) return null;
  if (scheme.toLowerCase() !== 'bearer') return null;
  return token;
}

function verifyProxyToken(token: string): ProxySessionClaims {
  const decoded = jwt.verify(token, tokenSecret()) as ProxySessionClaims;
  if (decoded.typ !== 'proxy_session') {
    throw new Error('Invalid token type');
  }
  return decoded;
}

async function bootstrap() {
  await app.register(helmet);
  await app.register(cors, { origin: true });

  app.get('/health', async () => ({ status: 'ok', service: 'ingress-router' }));

  app.all('/svc/:serviceKey/*', async (request, reply) => {
    const { serviceKey } = request.params as { serviceKey: string };
    const host = request.headers.host || '';

    const bearer = parseBearerToken(request.headers.authorization);
    const rawProxyToken =
      bearer ||
      (typeof request.headers['x-pytholit-proxy-token'] === 'string'
        ? request.headers['x-pytholit-proxy-token']
        : null);

    const apiKey =
      typeof request.headers['x-pytholit-api-key'] === 'string'
        ? request.headers['x-pytholit-api-key']
        : null;

    if (!rawProxyToken && !apiKey) {
      return reply.code(401).send({ detail: 'Missing proxy authorization' });
    }

    let claims: ProxySessionClaims | null = null;
    if (rawProxyToken) {
      try {
        claims = verifyProxyToken(rawProxyToken);
      } catch {
        return reply.code(401).send({ detail: 'Invalid or expired proxy session token' });
      }

      if (claims.serviceKey && claims.serviceKey !== '*' && claims.serviceKey !== serviceKey) {
        return reply.code(403).send({ detail: 'Proxy token is not allowed for this service' });
      }
    }

    return {
      ok: true,
      host,
      serviceKey,
      envId: claims?.envId ?? null,
      userId: claims?.sub ?? null,
      proxiedPath: request.url,
      authMode: claims ? 'site_session' : 'api_key',
      note: 'Token validated. Attach DynamoDB route lookup + TGW forwarding next.',
    };
  });

  const port = Number(process.env.PORT || 3402);
  await app.listen({ port, host: '0.0.0.0' });
}

void bootstrap();
