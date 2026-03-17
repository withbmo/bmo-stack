import { defineConfig } from 'prisma/config';

const DEFAULT_DB_PORT = '5432';
const DEFAULT_SSL_MODE = 'disable';

function buildUrl(options: {
  host: string;
  port: string;
  dbName: string;
  user: string;
  password: string;
  sslMode: string;
}) {
  const encodedUser = encodeURIComponent(options.user);
  const encodedPassword = encodeURIComponent(options.password);
  const params = new URLSearchParams({
    schema: 'public',
    sslmode: options.sslMode,
  });

  return `postgresql://${encodedUser}:${encodedPassword}@${options.host}:${options.port}/${options.dbName}?${params.toString()}`;
}

function resolvePrismaDatasourceUrl() {
  const host = process.env.DB_DIRECT_HOST || process.env.DB_HOST || 'localhost';
  const port = process.env.DB_DIRECT_PORT || process.env.DB_PORT || DEFAULT_DB_PORT;
  const dbName = process.env.DB_NAME || 'pytholit';
  const user = process.env.DB_USERNAME || 'postgres';
  const password = process.env.DB_PASSWORD || 'postgres';
  const sslMode = process.env.DB_SSLMODE || DEFAULT_SSL_MODE;

  return buildUrl({ host, port, dbName, user, password, sslMode });
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  engine: 'classic',
  datasource: {
    url: resolvePrismaDatasourceUrl(),
  },
});
