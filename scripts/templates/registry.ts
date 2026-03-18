import path from 'node:path';

import {
  type CommandSpec,
  type TemplateDefinition,
  patchTextFile,
  removeIfExists,
  runCommand,
  writeTextFile,
} from './shared.js';

function editorConfig(): string {
  return `root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.py]
indent_size = 4
`;
}

function nextWebManifest(): string {
  return `version = 1

[project]
id = "next-web"
name = "Next Web"
description = "Production-ready Next.js web starter"

[runtime]
modules = ["nodejs-24"]

[deployment]
target = "autoscale"
router = "application"
defaultEnvironment = "development"

[[artifacts]]
id = "web"
kind = "web"
path = "."

[artifacts.build]
command = "pnpm build"
outputDir = ".next"

[artifacts.dev]
command = "pnpm dev"
port = 3000

[[services]]
id = "web-http"
artifact = "web"
kind = "http"
public = true
secrets = []

[services.run]
command = "pnpm start -- --hostname 0.0.0.0 --port 3000"
port = 3000

[services.env]
PORT = "3000"

[[routes]]
service = "web-http"
path = "/"
stripPrefix = false

[environments.development]
domain = "localhost"

[environments.production]
domain = "app.example.com"
`;
}

function viteReactManifest(): string {
  return `version = 1

[project]
id = "vite-react-web"
name = "Vite React Web"
description = "Lean React SPA starter powered by Vite"

[runtime]
modules = ["nodejs-24"]

[deployment]
target = "autoscale"
router = "application"
defaultEnvironment = "development"

[[artifacts]]
id = "web"
kind = "web"
path = "."

[artifacts.build]
command = "pnpm build"
outputDir = "dist"

[artifacts.dev]
command = "pnpm dev"
port = 5173

[artifacts.env]
BASE_PATH = "/"

[[services]]
id = "web-static"
artifact = "web"
kind = "static"
public = true
secrets = []

[services.static]
publicDir = "dist"
spa = true
indexFile = "index.html"

[[routes]]
service = "web-static"
path = "/"
stripPrefix = false

[environments.development]
domain = "localhost"

[environments.production]
domain = "app.example.com"
`;
}

function fastifyManifest(): string {
  return `version = 1

[project]
id = "fastify-api"
name = "Fastify API"
description = "Lightweight TypeScript HTTP API starter"

[runtime]
modules = ["nodejs-24"]

[deployment]
target = "autoscale"
router = "application"
defaultEnvironment = "development"

[[artifacts]]
id = "api"
kind = "server"
path = "."

[artifacts.build]
command = "npm run build"
outputDir = "dist"

[artifacts.dev]
command = "npm run dev"
port = 3001

[[services]]
id = "api-http"
artifact = "api"
kind = "http"
public = true
secrets = []

[services.run]
command = "npm run start"
port = 3001

[services.env]
PORT = "3001"

[services.healthcheck]
path = "/health"
intervalSeconds = 10
timeoutSeconds = 3

[[routes]]
service = "api-http"
path = "/"
stripPrefix = false

[environments.development]
domain = "localhost"

[environments.production]
domain = "api.example.com"
`;
}

function fastApiManifest(): string {
  return `version = 1

[project]
id = "fastapi-api"
name = "FastAPI API"
description = "Modern Python API starter powered by uv and FastAPI"

[runtime]
modules = ["python-3.14"]

[deployment]
target = "autoscale"
router = "application"
defaultEnvironment = "development"

[[artifacts]]
id = "api"
kind = "server"
path = "."

[artifacts.dev]
command = "uv run uvicorn fastapi_api.app:app --reload --host 0.0.0.0 --port 8000"
port = 8000

[[services]]
id = "api-http"
artifact = "api"
kind = "http"
public = true
secrets = []

[services.run]
command = "uv run uvicorn fastapi_api.app:app --host 0.0.0.0 --port 8000"
port = 8000

[services.env]
PORT = "8000"

[services.healthcheck]
path = "/health"
intervalSeconds = 10
timeoutSeconds = 3

[[routes]]
service = "api-http"
path = "/"
stripPrefix = false

[environments.development]
domain = "localhost"

[environments.production]
domain = "api.example.com"
`;
}

function nextWebReadme(): string {
  return `# Next Web

Production-ready Next.js starter template for Pytholit.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- pnpm

## Init command

\`npx create-next-app@latest <dir> --ts --eslint --tailwind --app --src-dir --use-pnpm --skip-install --disable-git --yes --empty\`

## Pytholit finalization

After initialization, Pytholit:

- adds a stack-native source layout that is easy for humans and agents to extend
- keeps route files small and moves product content into features
- adds a typed env module under \`src/config\`
- adds \`pytholit.toml\`
- removes generator artifacts that do not belong in a standalone template

## Commands

- \`pnpm install\`
- \`pnpm dev\`
- \`pnpm run check\`
- \`pnpm build\`
- \`pnpm start -- --hostname 0.0.0.0 --port 3000\`

## Project structure

- \`src/app\`: route surfaces and Next.js framework files only
- \`src/features\`: product-facing feature content and sections
- \`src/components\`: reusable UI primitives
- \`src/config\`: environment parsing and typed runtime config
- \`src/lib\`: shared framework-light helpers

Add new pages in \`src/app\`, but keep real feature logic in \`src/features\`.

## Manifest

\`pytholit.toml\` is the source of truth for what this template builds and runs.

See [../ARCHITECTURE.md](../ARCHITECTURE.md) for the shared template contract.
`;
}

function viteReactReadme(): string {
  return `# Vite React Web

Lean React SPA starter template for Pytholit.

## Stack

- Vite
- React 19
- TypeScript
- pnpm

## Init command

\`pnpm create vite <dir> --template react-ts --no-interactive\`

## Pytholit finalization

After initialization, Pytholit:

- adds a stack-native source layout that separates app composition from features
- adds a typed env module under \`src/config\`
- replaces the default demo UI with a small app shell backed by feature modules
- adds \`pytholit.toml\`

## Commands

- \`pnpm install\`
- \`pnpm dev\`
- \`pnpm run check\`
- \`pnpm build\`

## Project structure

- \`src/app\`: root app composition
- \`src/features\`: feature areas and content
- \`src/components\`: reusable UI primitives
- \`src/config\`: environment parsing and typed runtime config
- \`src/lib\`: shared helpers

Add app-level composition in \`src/app\`, but keep reusable logic in \`src/features\` and \`src/components\`.

## Manifest

\`pytholit.toml\` is the source of truth for what this template builds and serves.

See [../ARCHITECTURE.md](../ARCHITECTURE.md) for the shared template contract.
`;
}

function fastifyReadme(): string {
  return `# Fastify API

Lightweight TypeScript Fastify API starter for Pytholit.

## Stack

- Fastify
- TypeScript
- npm

## Init commands

This template is bootstrapped with command-only initialization:

- \`npm init -y\`
- \`npm install fastify@latest\`
- \`npm install --save-dev typescript@latest tsx@latest @types/node@latest\`
- \`npm install --save-dev eslint@latest @eslint/js@latest typescript-eslint@latest globals@latest\`
- \`npx tsc --init ...\`

## Pytholit finalization

After initialization, Pytholit:

- keeps \`src/index.ts\` as a tiny runtime entrypoint
- composes the server in \`src/app.ts\`
- splits HTTP routes into \`src/routes\`
- keeps config in \`src/config\` and business logic in \`src/services\`
- adds \`pytholit.toml\`

## Commands

- \`npm install\`
- \`npm run dev\`
- \`npm run check\`
- \`npm run build\`
- \`npm run start\`

## Project structure

- \`src/index.ts\`: runtime entrypoint only
- \`src/app.ts\`: Fastify app composition
- \`src/routes\`: HTTP route registration
- \`src/config\`: environment parsing
- \`src/services\`: business logic
- \`src/lib\`: shared helpers

Add transport concerns in \`src/routes\`, but keep business logic in \`src/services\`.

## Manifest

\`pytholit.toml\` is the source of truth for runtime, build, and routing behavior.

See [../ARCHITECTURE.md](../ARCHITECTURE.md) for the shared template contract.
`;
}

function fastApiReadme(): string {
  return `# FastAPI API

Modern Python FastAPI starter for Pytholit.

## Stack

- Python 3.14
- uv
- FastAPI
- Uvicorn
- Ruff

## Init commands

- \`uv init <dir> --app --package --vcs none --no-workspace\`
- \`uv add fastapi uvicorn[standard]\`
- \`uv add --dev ruff\`

## Pytholit finalization

After initialization, Pytholit:

- keeps \`src/fastapi_api/main.py\` as a tiny runtime entrypoint
- composes the application in \`src/fastapi_api/app.py\`
- splits routes into \`src/fastapi_api/routes\`
- keeps config in \`src/fastapi_api/config\` and business logic in \`src/fastapi_api/services\`
- adds \`pytholit.toml\`

## Commands

- \`uv sync\`
- \`uv run ruff check .\`
- \`uv run ruff format --check .\`
- \`uv run uvicorn fastapi_api.app:app --reload --host 0.0.0.0 --port 8000\`
- \`uv run uvicorn fastapi_api.app:app --host 0.0.0.0 --port 8000\`

## Project structure

- \`src/fastapi_api/main.py\`: runtime entrypoint only
- \`src/fastapi_api/app.py\`: FastAPI app composition
- \`src/fastapi_api/routes\`: API route modules
- \`src/fastapi_api/config\`: settings and env parsing
- \`src/fastapi_api/services\`: business logic
- \`src/fastapi_api/lib\`: shared helpers

Add transport code in \`routes\`, but keep real logic in \`services\`.

## Manifest

\`pytholit.toml\` is the source of truth for runtime, routing, and environment expectations.

See [../ARCHITECTURE.md](../ARCHITECTURE.md) for the shared template contract.
`;
}

async function finalizeNextWeb(targetDir: string): Promise<void> {
  await removeIfExists(path.join(targetDir, 'pnpm-workspace.yaml'));
  await patchTextFile(path.join(targetDir, 'package.json'), (content) => {
    const pkg = JSON.parse(content) as Record<string, unknown>;
    pkg.version = '0.1.0';
    pkg.private = true;
    pkg.description = 'Production-ready Next.js web starter for Pytholit';
    if (typeof pkg.scripts === 'object' && pkg.scripts) {
      const scripts = pkg.scripts as Record<string, string>;
      scripts.dev = 'next dev --hostname 0.0.0.0 --port 3000';
      scripts.start = 'next start --hostname 0.0.0.0 --port 3000';
      scripts.lint = 'eslint . --max-warnings=0';
      scripts.typecheck = 'tsc --noEmit';
      scripts.check = 'pnpm lint && pnpm typecheck';
    }
    return `${JSON.stringify(pkg, null, 2)}\n`;
  });
  await writeTextFile(path.join(targetDir, '.editorconfig'), editorConfig());
  await writeTextFile(
    path.join(targetDir, '.env.example'),
    `NEXT_PUBLIC_APP_NAME=Pytholit Next Web
`,
  );
  await writeTextFile(
    path.join(targetDir, 'next.config.ts'),
    `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
`,
  );
  await writeTextFile(
    path.join(targetDir, 'src/config/env.ts'),
    `function readAppName(): string {
  return process.env.NEXT_PUBLIC_APP_NAME?.trim() || "Pytholit Next Web";
}

export const env = {
  appName: readAppName(),
} as const;
`,
  );
  await writeTextFile(
    path.join(targetDir, 'src/lib/project.ts'),
    `export const projectCopy = {
  eyebrow: "Pytholit Template",
  headline: "Build a serious web app on top of this Next.js starter.",
  description:
    "This template is intentionally minimal, but it is structured to be extended by an agent or teammate without first undoing throwaway demo code.",
} as const;
`,
  );
  await writeTextFile(
    path.join(targetDir, 'src/features/home/content.ts'),
    `export const homePillars = [
  {
    title: "Ship quickly",
    description: "Start from a clean App Router base with sensible defaults and a clear build path.",
  },
  {
    title: "Stay spec-first",
    description: "The accompanying pytholit.toml describes what the template builds and how it runs.",
  },
  {
    title: "Scale later",
    description: "Add APIs, auth, and managed resources without rewriting the project shape.",
  },
] as const;
`,
  );
  await writeTextFile(
    path.join(targetDir, 'src/components/section-card.tsx'),
    `import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  children: ReactNode;
}

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-3 text-sm leading-7 text-slate-300">{children}</div>
    </article>
  );
}
`,
  );
  await writeTextFile(
    path.join(targetDir, 'src/features/home/components/hero-section.tsx'),
    `import { SectionCard } from "@/components/section-card";
import { env } from "@/config/env";
import { homePillars } from "@/features/home/content";
import { projectCopy } from "@/lib/project";

export function HeroSection() {
  return (
    <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-10 px-6 py-24">
      <div className="space-y-6">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
          {projectCopy.eyebrow}
        </p>
        <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl">
          {projectCopy.headline}
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-300">{projectCopy.description}</p>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">App name: {env.appName}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {homePillars.map((pillar) => (
          <SectionCard key={pillar.title} title={pillar.title}>
            {pillar.description}
          </SectionCard>
        ))}
      </div>
    </section>
  );
}
`,
  );
  await writeTextFile(
    path.join(targetDir, 'src/app/layout.tsx'),
    `import type { Metadata } from "next";
import "./globals.css";
import { env } from "@/config/env";

export const metadata: Metadata = {
  title: env.appName,
  description: "A production-ready Next.js template for Pytholit projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
  );

  await writeTextFile(
    path.join(targetDir, 'src/app/page.tsx'),
    `import { HeroSection } from "@/features/home/components/hero-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <HeroSection />
    </main>
  );
}
`,
  );

  await writeTextFile(
    path.join(targetDir, 'src/app/globals.css'),
    `@import "tailwindcss";

:root {
  color-scheme: dark;
}

html,
body {
  margin: 0;
  min-height: 100%;
  background: #020617;
  color: #e2e8f0;
  font-family:
    "Geist",
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

* {
  box-sizing: border-box;
}

a {
  color: inherit;
  text-decoration: none;
}
`,
  );

  await writeTextFile(path.join(targetDir, 'README.md'), nextWebReadme());
  await writeTextFile(path.join(targetDir, 'pytholit.toml'), nextWebManifest());
}

async function finalizeViteReactWeb(targetDir: string): Promise<void> {
  await patchTextFile(path.join(targetDir, 'package.json'), (content) => {
    const pkg = JSON.parse(content) as Record<string, unknown>;
    pkg.version = '0.1.0';
    if (typeof pkg.scripts === 'object' && pkg.scripts) {
      const scripts = pkg.scripts as Record<string, string>;
      scripts.dev = 'vite --host 0.0.0.0 --port 5173';
      scripts.typecheck = 'tsc -b';
      scripts.build = 'pnpm typecheck && vite build';
      scripts.lint = 'eslint . --max-warnings=0';
      scripts.check = 'pnpm lint && pnpm typecheck';
      scripts.preview = 'vite preview --host 0.0.0.0 --port 4173';
    }
    return `${JSON.stringify(pkg, null, 2)}\n`;
  });
  await writeTextFile(path.join(targetDir, '.editorconfig'), editorConfig());
  await writeTextFile(
    path.join(targetDir, '.env.example'),
    `VITE_APP_NAME=Pytholit Vite React Web
`,
  );
  await removeIfExists(path.join(targetDir, 'public/icons.svg'));
  await removeIfExists(path.join(targetDir, 'public/favicon.svg'));
  await removeIfExists(path.join(targetDir, 'src/assets/hero.png'));
  await removeIfExists(path.join(targetDir, 'src/assets/react.svg'));
  await removeIfExists(path.join(targetDir, 'src/assets/vite.svg'));
  await writeTextFile(
    path.join(targetDir, 'index.html'),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="Lean React SPA starter template for Pytholit projects."
    />
    <title>Pytholit Vite React Web</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
  );
  await writeTextFile(
    path.join(targetDir, 'src/config/env.ts'),
    `function readAppName(): string {
  return import.meta.env.VITE_APP_NAME?.trim() || "Pytholit Vite React Web";
}

export const env = {
  appName: readAppName(),
} as const;
`,
  );
  await writeTextFile(
    path.join(targetDir, 'src/lib/project.ts'),
    `export const projectCopy = {
  eyebrow: "Pytholit Template",
  headline: "React SPA starter powered by Vite.",
  description:
    "Use this template when you want a focused client-side application with a clean build and static deployment story.",
} as const;
`,
  );
  await writeTextFile(
    path.join(targetDir, 'src/features/home/content.ts'),
    `export const homeSections = [
  {
    title: "Simple by default",
    description: "A small React surface with no platform-specific dead weight.",
  },
  {
    title: "Ready to grow",
    description: "Add API clients, auth, and routing without tearing the template apart.",
  },
  {
    title: "Manifest-backed",
    description: "pytholit.toml stays aligned with the project structure from day one.",
  },
] as const;
`,
  );
  await writeTextFile(
    path.join(targetDir, 'src/components/FeatureCard.tsx'),
    `import type { ReactNode } from "react";

interface FeatureCardProps {
  title: string;
  children: ReactNode;
}

export function FeatureCard({ title, children }: FeatureCardProps) {
  return (
    <article className="card">
      <h2>{title}</h2>
      <p>{children}</p>
    </article>
  );
}
`,
  );
  await writeTextFile(
    path.join(targetDir, 'src/features/home/components/HeroSection.tsx'),
    `import { FeatureCard } from "@/components/FeatureCard";
import { env } from "@/config/env";
import { homeSections } from "@/features/home/content";
import { projectCopy } from "@/lib/project";

export function HeroSection() {
  return (
    <>
      <header className="hero">
        <p className="eyebrow">{projectCopy.eyebrow}</p>
        <h1>{projectCopy.headline}</h1>
        <p className="lede">{projectCopy.description}</p>
        <p className="meta">App name: {env.appName}</p>
      </header>

      <section className="grid">
        {homeSections.map((section) => (
          <FeatureCard key={section.title} title={section.title}>
            {section.description}
          </FeatureCard>
        ))}
      </section>
    </>
  );
}
`,
  );
  await writeTextFile(
    path.join(targetDir, 'src/app/AppShell.tsx'),
    `import { HeroSection } from "@/features/home/components/HeroSection";

export function AppShell() {
  return (
    <main className="shell">
      <HeroSection />
    </main>
  );
}
`,
  );
  await writeTextFile(
    path.join(targetDir, 'vite.config.ts'),
    `import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "src"),
    },
  },
});
`,
  );

  await writeTextFile(
    path.join(targetDir, 'src/App.tsx'),
    `import "./App.css";
import { AppShell } from "./app/AppShell";

export default function App() {
  return <AppShell />;
}
`,
  );

  await writeTextFile(
    path.join(targetDir, 'src/App.css'),
    `:root {
  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  color: #e5eef7;
  background:
    radial-gradient(circle at top, rgba(56, 189, 248, 0.18), transparent 35%),
    linear-gradient(180deg, #020617 0%, #0f172a 100%);
}

body {
  margin: 0;
  min-height: 100vh;
}

#root {
  min-height: 100vh;
}

.shell {
  margin: 0 auto;
  max-width: 72rem;
  padding: 5rem 1.5rem;
}

.hero {
  max-width: 48rem;
}

.eyebrow {
  margin: 0 0 1rem;
  color: #67e8f9;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.hero h1 {
  margin: 0;
  font-size: clamp(3rem, 7vw, 5rem);
  line-height: 1;
}

.lede {
  margin-top: 1.5rem;
  max-width: 38rem;
  color: #cbd5e1;
  font-size: 1.1rem;
  line-height: 1.8;
}

.meta {
  margin-top: 1rem;
  color: #94a3b8;
  font-size: 0.85rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.grid {
  display: grid;
  gap: 1rem;
  margin-top: 3rem;
}

.card {
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 1.25rem;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
}

.card h2 {
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
}

.card p {
  margin: 0;
  color: #cbd5e1;
  line-height: 1.7;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
`,
  );

  await writeTextFile(
    path.join(targetDir, 'src/index.css'),
    `:root {
  color-scheme: dark;
  background-color: #020617;
  color: #e5eef7;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  min-height: 100%;
}

body {
  min-width: 320px;
}
`,
  );
  await patchTextFile(path.join(targetDir, 'tsconfig.app.json'), (content) =>
    content.replace(
      '"skipLibCheck": true,',
      `"skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },`,
    ),
  );

  await writeTextFile(path.join(targetDir, 'README.md'), viteReactReadme());
  await writeTextFile(path.join(targetDir, 'pytholit.toml'), viteReactManifest());
}

async function finalizeFastifyApi(targetDir: string): Promise<void> {
  await patchTextFile(path.join(targetDir, 'package.json'), (content) => {
    const pkg = JSON.parse(content) as Record<string, unknown>;
    pkg.version = '0.1.0';
    pkg.private = true;
    pkg.description = 'Lightweight TypeScript HTTP API starter for Pytholit';

    if (typeof pkg.scripts === 'object' && pkg.scripts) {
      const scripts = pkg.scripts as Record<string, unknown>;
      delete scripts.test;
      scripts.lint = 'eslint src --max-warnings=0';
      scripts.check = 'npm run lint && npm run typecheck';
    }

    return `${JSON.stringify(pkg, null, 2)}\n`;
  });
  await writeTextFile(path.join(targetDir, '.editorconfig'), editorConfig());
  await writeTextFile(
    path.join(targetDir, '.env.example'),
    `PORT=3001
DATABASE_URL=
`,
  );

  await writeTextFile(
    path.join(targetDir, 'src/config/env.ts'),
    `function readPort(): number {
  const rawPort = process.env.PORT ?? "3001";
  const parsedPort = Number.parseInt(rawPort, 10);

  if (Number.isNaN(parsedPort)) {
    throw new Error(\`Invalid PORT value "\${rawPort}"\`);
  }

  return parsedPort;
}

export const env = {
  port: readPort(),
} as const;
`,
  );
  await writeTextFile(
    path.join(targetDir, 'src/services/status-service.ts'),
    `export function getServiceStatus() {
  return {
    service: "fastify-api",
    ok: true,
    message: "Pytholit Fastify template is running",
  } as const;
}
`,
  );
  await writeTextFile(
    path.join(targetDir, 'src/routes/root.ts'),
    `import type { FastifyInstance } from "fastify";

import { getServiceStatus } from "../services/status-service.js";

export async function registerRootRoutes(app: FastifyInstance) {
  app.get("/", async () => getServiceStatus());
}
`,
  );
  await writeTextFile(
    path.join(targetDir, 'src/routes/health.ts'),
    `import type { FastifyInstance } from "fastify";

export async function registerHealthRoutes(app: FastifyInstance) {
  app.get("/health", async () => ({
    status: "ok",
  }));
}
`,
  );
  await writeTextFile(
    path.join(targetDir, 'src/app.ts'),
    `import Fastify from "fastify";

import { registerHealthRoutes } from "./routes/health.js";
import { registerRootRoutes } from "./routes/root.js";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  void registerRootRoutes(app);
  void registerHealthRoutes(app);

  return app;
}
`,
  );
  await writeTextFile(
    path.join(targetDir, 'src/lib/server.ts'),
    `export function listenHost(): string {
  return "0.0.0.0";
}
`,
  );
  await writeTextFile(
    path.join(targetDir, 'src/index.ts'),
    `import { buildApp } from "./app.js";
import { env } from "./config/env.js";
import { listenHost } from "./lib/server.js";

const app = buildApp();

app.listen({ host: listenHost(), port: env.port }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
`,
  );
  await writeTextFile(
    path.join(targetDir, 'eslint.config.mjs'),
    `import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node,
      },
      sourceType: "module",
    },
    rules: {
      "no-console": "off",
    },
  },
);
`,
  );

  await writeTextFile(
    path.join(targetDir, '.gitignore'),
    `node_modules
dist
.env
`,
  );

  await writeTextFile(path.join(targetDir, 'README.md'), fastifyReadme());
  await writeTextFile(path.join(targetDir, 'pytholit.toml'), fastifyManifest());
}

async function finalizeFastApi(targetDir: string): Promise<void> {
  await patchTextFile(path.join(targetDir, 'pyproject.toml'), (content) => {
    const updated = content
      .replace('description = "Add your description here"', 'description = "Modern FastAPI starter for Pytholit"')
      .replace(/authors = \[[\s\S]*?\]\n/, '')
      .replace('fastapi-api = "fastapi_api:main"', 'fastapi-api = "fastapi_api.main:main"');

    if (updated.includes('[tool.ruff]')) {
      return updated;
    }

    return `${updated}
[tool.ruff]
line-length = 100
target-version = "py314"

[tool.ruff.lint]
select = ["E", "F", "I", "B"]
`;
  });
  await writeTextFile(path.join(targetDir, '.editorconfig'), editorConfig());
  await writeTextFile(
    path.join(targetDir, '.env.example'),
    `PORT=8000
DATABASE_URL=
`,
  );

  await writeTextFile(
    path.join(targetDir, 'src/fastapi_api/__init__.py'),
    `from .app import app

__all__ = ["app"]
`,
  );
  await writeTextFile(path.join(targetDir, 'src/fastapi_api/config/__init__.py'), ``);
  await writeTextFile(path.join(targetDir, 'src/fastapi_api/routes/__init__.py'), ``);
  await writeTextFile(path.join(targetDir, 'src/fastapi_api/services/__init__.py'), ``);
  await writeTextFile(path.join(targetDir, 'src/fastapi_api/lib/__init__.py'), ``);

  await writeTextFile(
    path.join(targetDir, 'src/fastapi_api/app.py'),
    `from fastapi import FastAPI

from fastapi_api.routes.health import router as health_router
from fastapi_api.routes.root import router as root_router


def create_app() -> FastAPI:
    app = FastAPI(
        title="Pytholit FastAPI Template",
        description="A modern Python API starter built with uv and FastAPI.",
    )
    app.include_router(root_router)
    app.include_router(health_router)
    return app


app = create_app()
`,
  );

  await writeTextFile(
    path.join(targetDir, 'src/fastapi_api/main.py'),
    `import uvicorn

from fastapi_api.config.settings import settings
from fastapi_api.lib.server import host


def main() -> None:
    uvicorn.run("fastapi_api.app:app", host=host(), port=settings.port)
`,
  );
  await writeTextFile(
    path.join(targetDir, 'src/fastapi_api/config/settings.py'),
    `import os
from dataclasses import dataclass


def read_port() -> int:
    raw_port = os.getenv("PORT", "8000")

    try:
        return int(raw_port)
    except ValueError as error:
        raise ValueError(f'Invalid PORT value "{raw_port}"') from error


@dataclass(frozen=True)
class Settings:
    port: int


settings = Settings(port=read_port())
`,
  );
  await writeTextFile(
    path.join(targetDir, 'src/fastapi_api/services/status_service.py'),
    `def service_status() -> dict[str, str | bool]:
    return {
        "service": "fastapi-api",
        "ok": True,
        "message": "Pytholit FastAPI template is running",
    }
`,
  );
  await writeTextFile(
    path.join(targetDir, 'src/fastapi_api/routes/root.py'),
    `from fastapi import APIRouter

from fastapi_api.services.status_service import service_status

router = APIRouter()


@router.get("/")
def read_root() -> dict[str, str | bool]:
    return service_status()
`,
  );
  await writeTextFile(
    path.join(targetDir, 'src/fastapi_api/routes/health.py'),
    `from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
    }
`,
  );
  await writeTextFile(
    path.join(targetDir, 'src/fastapi_api/lib/server.py'),
    `def host() -> str:
    return "0.0.0.0"
`,
  );

  await removeIfExists(path.join(targetDir, '.venv'));
  await writeTextFile(path.join(targetDir, 'README.md'), fastApiReadme());
  await writeTextFile(path.join(targetDir, 'pytholit.toml'), fastApiManifest());
}

function targetCommand(cwd: string, command: string, ...args: string[]): CommandSpec {
  return { cwd, command, args };
}

export const templateRegistry: TemplateDefinition[] = [
  {
    id: 'next-web',
    title: 'Next Web',
    category: 'web',
    stack: 'nextjs',
    packageManager: 'pnpm',
    initCommands(targetDir) {
      return [
        {
          command: 'npx',
          args: [
            'create-next-app@latest',
            targetDir,
            '--ts',
            '--eslint',
            '--tailwind',
            '--app',
            '--src-dir',
            '--use-pnpm',
            '--skip-install',
            '--disable-git',
            '--yes',
            '--empty',
          ],
        },
      ];
    },
    finalize: finalizeNextWeb,
    installCommand: targetCommand('{{target}}', 'pnpm', '--ignore-workspace', 'install'),
    qualityCommands: [targetCommand('{{target}}', 'pnpm', '--ignore-workspace', 'run', 'check')],
    buildCommand: targetCommand('{{target}}', 'pnpm', '--ignore-workspace', 'build'),
    devCommand: targetCommand('{{target}}', 'pnpm', '--ignore-workspace', 'dev'),
    smokeCheck: { url: 'http://127.0.0.1:3000', timeoutMs: 90_000 },
    requiredPaths: [
      'src/app/page.tsx',
      'src/features/home/components/hero-section.tsx',
      'src/components/section-card.tsx',
      'src/config/env.ts',
      'src/lib/project.ts',
    ],
    requiredScripts: ['dev', 'build', 'start', 'check'],
    fileAssertions: [
      {
        path: 'src/app/page.tsx',
        includes: ['HeroSection'],
        maxLines: 20,
      },
      {
        path: 'src/app/layout.tsx',
        includes: ['env.appName'],
        maxLines: 25,
      },
      {
        path: 'src/config/env.ts',
        includes: ['NEXT_PUBLIC_APP_NAME'],
      },
    ],
    readmeInitCommand:
      'npx create-next-app@latest <dir> --ts --eslint --tailwind --app --src-dir --use-pnpm --skip-install --disable-git --yes --empty',
  },
  {
    id: 'vite-react-web',
    title: 'Vite React Web',
    category: 'web',
    stack: 'vite-react',
    packageManager: 'pnpm',
    initCommands(targetDir) {
      const parentDir = path.dirname(targetDir);
      const dirName = path.basename(targetDir);

      return [
        {
          command: 'pnpm',
          args: ['create', 'vite', dirName, '--template', 'react-ts', '--no-interactive'],
          cwd: parentDir,
        },
      ];
    },
    finalize: finalizeViteReactWeb,
    installCommand: targetCommand('{{target}}', 'pnpm', '--ignore-workspace', 'install'),
    qualityCommands: [targetCommand('{{target}}', 'pnpm', '--ignore-workspace', 'run', 'check')],
    buildCommand: targetCommand('{{target}}', 'pnpm', '--ignore-workspace', 'build'),
    devCommand: targetCommand('{{target}}', 'pnpm', '--ignore-workspace', 'dev'),
    smokeCheck: { url: 'http://127.0.0.1:5173', timeoutMs: 60_000 },
    requiredPaths: [
      'src/app/AppShell.tsx',
      'src/features/home/components/HeroSection.tsx',
      'src/components/FeatureCard.tsx',
      'src/config/env.ts',
      'src/lib/project.ts',
      'vite.config.ts',
    ],
    requiredScripts: ['dev', 'build', 'preview', 'check'],
    fileAssertions: [
      {
        path: 'src/App.tsx',
        includes: ['AppShell'],
        maxLines: 10,
      },
      {
        path: 'src/config/env.ts',
        includes: ['VITE_APP_NAME'],
      },
      {
        path: 'vite.config.ts',
        includes: ['alias', '"@"'],
      },
    ],
    readmeInitCommand: 'pnpm create vite <dir> --template react-ts --no-interactive',
  },
  {
    id: 'fastify-api',
    title: 'Fastify API',
    category: 'api',
    stack: 'fastify',
    packageManager: 'npm',
    initCommands(targetDir) {
      return [
        targetCommand(targetDir, 'npm', 'init', '-y'),
        targetCommand(targetDir, 'npm', 'pkg', 'set', 'name=fastify-api'),
        targetCommand(targetDir, 'npm', 'pkg', 'set', 'private=true'),
        targetCommand(targetDir, 'npm', 'pkg', 'set', 'type=module'),
        targetCommand(targetDir, 'npm', 'pkg', 'set', 'scripts.dev=tsx watch src/index.ts'),
        targetCommand(targetDir, 'npm', 'pkg', 'set', 'scripts.build=tsc -p tsconfig.json'),
        targetCommand(targetDir, 'npm', 'pkg', 'set', 'scripts.start=node dist/index.js'),
        targetCommand(targetDir, 'npm', 'pkg', 'set', 'scripts.typecheck=tsc --noEmit'),
        targetCommand(targetDir, 'npm', 'pkg', 'delete', 'main'),
        targetCommand(targetDir, 'npm', 'install', 'fastify@latest'),
        targetCommand(
          targetDir,
          'npm',
          'install',
          '--save-dev',
          'typescript@latest',
          'tsx@latest',
          '@types/node@latest',
          'eslint@latest',
          '@eslint/js@latest',
          'typescript-eslint@latest',
          'globals@latest',
        ),
        targetCommand(
          targetDir,
          'npx',
          'tsc',
          '--init',
          '--rootDir',
          'src',
          '--outDir',
          'dist',
          '--module',
          'esnext',
          '--moduleResolution',
          'bundler',
          '--target',
          'es2022',
          '--esModuleInterop',
          '--resolveJsonModule',
          '--strict',
          'true',
          '--skipLibCheck',
          'true',
        ),
      ];
    },
    finalize: finalizeFastifyApi,
    installCommand: targetCommand('{{target}}', 'npm', 'install'),
    qualityCommands: [targetCommand('{{target}}', 'npm', 'run', 'check')],
    buildCommand: targetCommand('{{target}}', 'npm', 'run', 'build'),
    devCommand: targetCommand('{{target}}', 'npm', 'run', 'dev'),
    smokeCheck: { url: 'http://127.0.0.1:3001/health', timeoutMs: 60_000 },
    requiredPaths: [
      'src/index.ts',
      'src/app.ts',
      'src/routes/root.ts',
      'src/routes/health.ts',
      'src/config/env.ts',
      'src/services/status-service.ts',
      'src/lib/server.ts',
    ],
    requiredScripts: ['dev', 'build', 'start', 'check'],
    fileAssertions: [
      {
        path: 'src/index.ts',
        includes: ['buildApp', 'env.port'],
        maxLines: 12,
      },
      {
        path: 'src/app.ts',
        includes: ['registerRootRoutes', 'registerHealthRoutes'],
        maxLines: 16,
      },
      {
        path: 'src/config/env.ts',
        includes: ['process.env.PORT'],
      },
    ],
    readmeInitCommand:
      'npm init -y && npm install fastify@latest && npm install --save-dev typescript@latest tsx@latest @types/node@latest && npx tsc --init ...',
  },
  {
    id: 'fastapi-api',
    title: 'FastAPI API',
    category: 'api',
    stack: 'fastapi',
    packageManager: 'uv',
    initCommands(targetDir) {
      return [
        {
          command: 'uv',
          args: ['init', targetDir, '--app', '--package', '--vcs', 'none', '--no-workspace'],
        },
        targetCommand(targetDir, 'uv', 'add', 'fastapi', 'uvicorn[standard]'),
        targetCommand(targetDir, 'uv', 'add', '--dev', 'ruff'),
      ];
    },
    finalize: finalizeFastApi,
    installCommand: targetCommand('{{target}}', 'uv', 'sync'),
    qualityCommands: [
      targetCommand('{{target}}', 'uv', 'run', 'ruff', 'check', '.'),
      targetCommand('{{target}}', 'uv', 'run', 'ruff', 'format', '--check', '.'),
    ],
    buildCommand: null,
    devCommand: targetCommand(
      '{{target}}',
      'uv',
      'run',
      'uvicorn',
      'fastapi_api.app:app',
      '--reload',
      '--host',
      '0.0.0.0',
      '--port',
      '8000',
    ),
    smokeCheck: { url: 'http://127.0.0.1:8000/health', timeoutMs: 60_000 },
    requiredPaths: [
      'src/fastapi_api/main.py',
      'src/fastapi_api/app.py',
      'src/fastapi_api/routes/root.py',
      'src/fastapi_api/routes/health.py',
      'src/fastapi_api/config/settings.py',
      'src/fastapi_api/services/status_service.py',
      'src/fastapi_api/lib/server.py',
    ],
    fileAssertions: [
      {
        path: 'src/fastapi_api/main.py',
        includes: ['settings.port', 'host()'],
        maxLines: 10,
      },
      {
        path: 'src/fastapi_api/app.py',
        includes: ['include_router(root_router)', 'include_router(health_router)'],
        maxLines: 18,
      },
      {
        path: 'src/fastapi_api/config/settings.py',
        includes: ['os.getenv("PORT"', 'class Settings'],
      },
    ],
    readmeInitCommand:
      'uv init <dir> --app --package --vcs none --no-workspace && uv add fastapi uvicorn[standard] && uv add --dev ruff',
  },
];

export function getTemplateDefinitions(templateId?: string): TemplateDefinition[] {
  if (!templateId) {
    return templateRegistry;
  }

  const definition = templateRegistry.find((item) => item.id === templateId);
  if (!definition) {
    throw new Error(`Unknown template "${templateId}"`);
  }
  return [definition];
}

export function withTargetDir(spec: CommandSpec, targetDir: string): CommandSpec {
  return {
    ...spec,
    cwd: spec.cwd === '{{target}}' ? targetDir : spec.cwd,
  };
}

export async function generateTemplate(definition: TemplateDefinition, targetDir: string): Promise<void> {
  for (const command of definition.initCommands(targetDir)) {
    await runCommand(command, `${definition.id} init`);
  }

  await definition.finalize(targetDir);
}
