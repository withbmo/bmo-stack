import { defineConfig } from 'prisma/config';

const fallbackUrl = 'postgresql://postgres:postgres@localhost:5432/postgres?schema=public';
const datasourceUrl = process.env.DATABASE_URL || fallbackUrl;

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  engine: 'classic',
  datasource: {
    url: datasourceUrl,
  },
});
