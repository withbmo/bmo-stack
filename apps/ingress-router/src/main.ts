import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import jwt from 'jsonwebtoken';
import { createHash, timingSafeEqual } from 'crypto';

import { port, tokenSecret } from './config.js';

const app = Fastify({ logger: true });

type ProxySessionClaims = {
  typ: 'proxy_session';
  sub: string;
  envId: string;
  serviceKey?: string;
  exp?: number;
};

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

function sha256Hex(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function constantTimeHexEquals(a: string, b: string): boolean {
  const left = Buffer.from(a, 'hex');
  const right = Buffer.from(b, 'hex');
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function configuredApiKeyHashes(): string[] {
  return (process.env.PYTHOLIT_PROXY_API_KEY_HASHES ?? '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter((value) => /^[a-f0-9]{64}$/.test(value));
}

function verifyApiKey(apiKey: string): boolean {
  const hashes = configuredApiKeyHashes();
  if (hashes.length === 0) return false;
  const candidate = sha256Hex(apiKey);
  return hashes.some((hash) => constantTimeHexEquals(candidate, hash));
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
    } else if (apiKey) {
      if (!verifyApiKey(apiKey)) {
        return reply.code(401).send({ detail: 'Invalid API key' });
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

  await app.listen({ port: port(), host: '0.0.0.0' });
}

void bootstrap();
