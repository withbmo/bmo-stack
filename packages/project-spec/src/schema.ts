import { z } from 'zod';

const envValueSchema = z.union([z.string(), z.number(), z.boolean()]).transform((value) => String(value));
const stringRecordSchema = z.object({}).catchall(envValueSchema).default({});
const resourceConfigSchema = z
  .object({})
  .catchall(z.union([z.string(), z.number(), z.boolean()]))
  .default({});
const metadataSchema = z.object({}).catchall(z.string()).default({});
const injectSchema = z.object({}).catchall(z.string().min(1));

const runtimeSchema = z.object({
  modules: z.array(z.string().min(1)).default([]),
}).default({ modules: [] });

const deploymentSchema = z.object({
  target: z.string().min(1).default('autoscale'),
  router: z.string().min(1).default('application'),
  defaultEnvironment: z.string().min(1).default('development'),
}).default({
  target: 'autoscale',
  router: 'application',
  defaultEnvironment: 'development',
});

const artifactSchema = z.object({
  id: z.string().min(1),
  kind: z.string().min(1),
  path: z.string().min(1),
  build: z.object({
    command: z.string().min(1),
    outputDir: z.string().min(1).optional(),
  }).optional(),
  dev: z.object({
    command: z.string().min(1).optional(),
    port: z.number().int().positive().optional(),
  }).optional(),
  env: stringRecordSchema,
});

const serviceSchema = z.object({
  id: z.string().min(1),
  artifact: z.string().min(1),
  kind: z.string().min(1),
  public: z.boolean().default(false),
  env: stringRecordSchema,
  secrets: z.array(z.string().min(1)).default([]),
  run: z.object({
    command: z.string().min(1).optional(),
    port: z.number().int().positive().optional(),
  }).optional(),
  static: z.object({
    publicDir: z.string().min(1),
    spa: z.boolean().default(false),
    indexFile: z.string().min(1).default('index.html'),
  }).optional(),
  healthcheck: z.object({
    path: z.string().min(1).optional(),
    command: z.string().min(1).optional(),
    intervalSeconds: z.number().int().positive().default(10),
    timeoutSeconds: z.number().int().positive().default(3),
  }).optional(),
});

const routeSchema = z.object({
  service: z.string().min(1),
  path: z.string().min(1),
  stripPrefix: z.boolean().default(false),
  host: z.string().min(1).optional(),
});

const resourceSchema = z.object({
  id: z.string().min(1),
  kind: z.string().min(1),
  mode: z.string().min(1).default('managed'),
  version: z.string().min(1).optional(),
  enabled: z.boolean().default(true),
  config: resourceConfigSchema,
});

const bindingSchema = z.object({
  service: z.string().min(1),
  resource: z.string().min(1),
  whenEnabled: z.boolean().default(true),
  inject: injectSchema,
});

const environmentSchema = z.object({
  domain: z.string().min(1).optional(),
  env: stringRecordSchema,
}).default({ env: {} });
const environmentsSchema = z.object({}).catchall(environmentSchema).default({});

export const rawProjectSpecSchema = z.object({
  version: z.number().int().positive(),
  project: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1).optional(),
    metadata: metadataSchema,
  }),
  runtime: runtimeSchema,
  deployment: deploymentSchema,
  artifacts: z.array(artifactSchema).default([]),
  services: z.array(serviceSchema).default([]),
  routes: z.array(routeSchema).default([]),
  resources: z.array(resourceSchema).default([]),
  bindings: z.array(bindingSchema).default([]),
  environments: environmentsSchema,
});

export type RawProjectSpecInput = z.input<typeof rawProjectSpecSchema>;
export type RawProjectSpec = z.output<typeof rawProjectSpecSchema>;
