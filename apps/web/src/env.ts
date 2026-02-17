import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_APP_ENV: z.enum(['localhost', 'development', 'production']).optional(),
    NEXT_PUBLIC_API_URL: z.string().optional(),
    NEXT_PUBLIC_API_URL_DEV: z.string().optional(),
    NEXT_PUBLIC_API_URL_PROD: z.string().optional(),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),
    NEXT_PUBLIC_NOVU_APP_ID: z.string().optional(),
    NEXT_PUBLIC_NOVU_API_URL: z.string().optional(),
    NEXT_PUBLIC_NOVU_WS_URL: z.string().optional(),
    NEXT_PUBLIC_WIZARD_SCHEMA_VERSION: z.string().optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_API_URL_DEV: process.env.NEXT_PUBLIC_API_URL_DEV,
    NEXT_PUBLIC_API_URL_PROD: process.env.NEXT_PUBLIC_API_URL_PROD,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    NEXT_PUBLIC_NOVU_APP_ID: process.env.NEXT_PUBLIC_NOVU_APP_ID,
    NEXT_PUBLIC_NOVU_API_URL: process.env.NEXT_PUBLIC_NOVU_API_URL,
    NEXT_PUBLIC_NOVU_WS_URL: process.env.NEXT_PUBLIC_NOVU_WS_URL,
    NEXT_PUBLIC_WIZARD_SCHEMA_VERSION: process.env.NEXT_PUBLIC_WIZARD_SCHEMA_VERSION,
  },
});
