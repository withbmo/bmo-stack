# TOML Spec Reference

This document explains the Pytholit project spec as a TOML language, not just as TypeScript types.

The standard filename for this manifest is:

```text
pytholit.toml
```

In templates and user projects, this file should live at the project root.

The goal of the spec is to describe a user project in a durable, infrastructure-agnostic way.

It is designed to answer these questions clearly:

- what exists in the project
- what can be built
- what can run
- what is public
- how routing works
- what secrets are required
- what resources are optionally platform-managed
- how services bind to those resources when they exist

## Design principles

Before getting into syntax, the most important design rules are:

### The spec is the source of truth

Dockerfiles, Compose files, ECS task definitions, Kubernetes manifests, and router configs should be derived from the spec.

They are not the domain model.

### Artifact is not service

An artifact describes something buildable.

A service describes something runnable.

They must stay separate because build topology and runtime topology often diverge over time.

### Routes are first-class

Routes do not live inside service startup commands.

They are explicit project-level declarations so routing can evolve independently.

### Resources are optional

A service may require `DATABASE_URL` even when the platform does not manage a database.

That is why secrets and managed resources are modeled separately.

## Full shape

At a high level, a project spec may contain:

```toml
version = 1

[project]

[runtime]

[deployment]

[[artifacts]]
[artifacts.build]
[artifacts.dev]
[artifacts.env]

[[services]]
[services.run]
[services.static]
[services.env]
[services.healthcheck]

[[routes]]

[[resources]]
[resources.config]

[[bindings]]

[environments.<name>]
[environments.<name>.env]
```

Not every block is required in every project, but this is the full vocabulary supported by the current package.

## Standard filename

The canonical filename for the project spec is:

```text
pytholit.toml
```

Recommended convention:

- one `pytholit.toml` per project root
- in repo templates, place it directly under each template directory
- agents should treat `pytholit.toml` as the first file to inspect when understanding a project

## Top-level fields

### `version`

```toml
version = 1
```

This is the manifest format version.

Current rules:

- required
- must be an integer
- currently only `1` is supported

This field is important for long-term durability. Future changes should add new versions instead of silently changing `version = 1` semantics.

## `[project]`

The `[project]` table identifies the project itself.

Example:

```toml
[project]
id = "open-studio"
name = "Open Studio"
description = "Open-source multi-app platform"
```

Fields:

- `id`
  Stable project identifier inside the spec.
- `name`
  Human-readable name.
- `description`
  Optional human-readable description.

Intended meaning:

- this describes the project as a whole
- it is not a service id
- it is not a deployment id
- it is not a repo URL

Current implementation notes:

- `id` is required
- `name` is required
- `description` is optional
- the internal model also supports `metadata`, but TOML examples should keep the root simple unless you need extra project-level annotations later

## `[runtime]`

The `[runtime]` table declares the runtime capabilities used by the project.

Example:

```toml
[runtime]
modules = ["nodejs-24", "postgres-16"]
```

Fields:

- `modules`
  A list of named runtime capabilities or modules.

Examples:

- `nodejs-24`
- `python-3.12`
- `postgres-16`
- `redis-7`

Intended meaning:

- this is descriptive, not executable by itself
- it tells planners and adapters which runtime families may be needed
- it must not force infrastructure coupling by itself

Current defaults:

- `modules = []` if omitted

Best practice:

- use modules to declare important runtime capabilities
- do not treat this as a dependency lockfile
- do not encode adapter-specific flags here

## `[deployment]`

The `[deployment]` table describes high-level deployment behavior.

Example:

```toml
[deployment]
target = "autoscale"
router = "application"
defaultEnvironment = "development"
```

Fields:

- `target`
  High-level deployment mode or target family.
- `router`
  High-level router mode.
- `defaultEnvironment`
  The default environment name used when planning runtime behavior.

Current defaults:

- `target = "autoscale"`
- `router = "application"`
- `defaultEnvironment = "development"`

Current validation:

- `defaultEnvironment` must exist under `[environments.<name>]`

Intended meaning:

- these are planning hints, not cloud-specific resources
- this block should stay high-level and stable
- it should not contain ECS/Kubernetes details directly

## `[[artifacts]]`

Artifacts describe buildable units.

This is one of the most important parts of the spec.

Example:

```toml
[[artifacts]]
id = "api"
kind = "server"
path = "services/api"

[artifacts.build]
command = "pnpm --filter @workspace/api run build"
outputDir = "dist"

[artifacts.dev]
command = "pnpm --filter @workspace/api run dev"
port = 3000

[artifacts.env]
NODE_ENV = "development"
```

Fields on each artifact:

- `id`
  Unique artifact id.
- `kind`
  Broad artifact category such as `web`, `server`, or `worker`.
- `path`
  Source path relative to the project root.

Subtables:

- `[artifacts.build]`
- `[artifacts.dev]`
- `[artifacts.env]`

### `[artifacts.build]`

Build-time description of the artifact.

Fields:

- `command`
  Command used to build the artifact.
- `outputDir`
  Optional build output directory.

### `[artifacts.dev]`

Development-time description of the artifact.

Fields:

- `command`
  Dev command, often a watch server.
- `port`
  Optional dev port.

### `[artifacts.env]`

Artifact-scoped environment variables.

These are not secrets.

They describe stable configuration that belongs to the buildable unit itself.

Current rules:

- at least one artifact is required
- artifact ids must be unique
- each artifact must define at least one of:
  - `build.command`
  - `dev.command`

Intended meaning:

- artifacts answer “what can be built?”
- they should not answer routing or public exposure questions

## `[[services]]`

Services describe runnable units.

Example:

```toml
[[services]]
id = "api-http"
artifact = "api"
kind = "http"
public = true
secrets = ["DATABASE_URL", "JWT_SECRET"]

[services.run]
command = "node ./dist/index.js"
port = 3000

[services.env]
PORT = "3000"

[services.healthcheck]
path = "/health"
intervalSeconds = 10
timeoutSeconds = 3
```

Fields on each service:

- `id`
  Unique service id.
- `artifact`
  Reference to the artifact this service runs from.
- `kind`
  Broad runtime kind such as `http` or `static`.
- `public`
  Whether this service is intended to be public.
- `secrets`
  Secret names the service requires.

Subtables:

- `[services.run]`
- `[services.static]`
- `[services.env]`
- `[services.healthcheck]`

### `[services.run]`

Runtime execution details.

Fields:

- `command`
  Runtime command.
- `port`
  Runtime port.

### `[services.static]`

Static-serving configuration for services that serve built files.

Example:

```toml
[services.static]
publicDir = "dist"
spa = true
indexFile = "index.html"
```

Fields:

- `publicDir`
  Directory to serve.
- `spa`
  Whether SPA fallback behavior is expected.
- `indexFile`
  Default index file.

### `[services.env]`

Service-scoped non-secret environment variables.

These override or extend artifact and environment-level values during planning.

### `[services.healthcheck]`

Healthcheck configuration for runtime planning.

Fields:

- `path`
  Optional HTTP health path.
- `command`
  Optional command-based healthcheck.
- `intervalSeconds`
  Polling interval.
- `timeoutSeconds`
  Timeout.

Current defaults:

- `public = false`
- `secrets = []`
- `intervalSeconds = 10`
- `timeoutSeconds = 3`
- static `spa = false`
- static `indexFile = "index.html"`

Current validation:

- at least one service is required
- service ids must be unique
- every service must reference a real artifact
- `kind = "static"` requires `[services.static]`
- only `static` services may define `[services.static]`
- `kind = "http"` currently requires `[services.run].port`

Intended meaning:

- services answer “what runs?”
- services are the place for runtime secrets and runtime commands
- services should not contain route declarations

## `[[routes]]`

Routes connect public paths to services.

Example:

```toml
[[routes]]
service = "api-http"
path = "/api/"
stripPrefix = true
```

Fields:

- `service`
  Service id this route targets.
- `path`
  Public path prefix.
- `stripPrefix`
  Whether the router removes the public prefix before forwarding.
- `host`
  Optional future-friendly host-based route matcher.

Current defaults:

- `stripPrefix = false`

Current validation:

- route path must start with `/`
- route service must exist

Intended meaning:

- routes are explicit ingress declarations
- a public service may have zero or more routes
- a service can be public without being implicitly mounted anywhere

## `[[resources]]`

Resources describe optional platform-managed infrastructure.

Example:

```toml
[[resources]]
id = "main-db"
kind = "postgres"
mode = "managed"
version = "16"
enabled = false

[resources.config]
database = "app"
username = "app"
```

Fields:

- `id`
  Unique resource id.
- `kind`
  Resource type such as `postgres`, `redis`, or `object-storage`.
- `mode`
  Resource mode such as `managed`.
- `version`
  Optional version string.
- `enabled`
  Whether the managed resource is enabled for the current project spec.

Subtable:

- `[resources.config]`

### `[resources.config]`

Free-form configuration for that resource.

Examples:

- database name
- username
- bucket name
- engine-specific settings

Current defaults:

- `mode = "managed"`
- `enabled = true`
- `config = {}`

Current validation:

- resource ids must be unique

Intended meaning:

- resources are optional platform-managed infrastructure
- they should not be mandatory for a service to ask for secrets
- they make platform-native services possible without forcing them

## `[[bindings]]`

Bindings connect services to resources.

Example:

```toml
[[bindings]]
service = "api-http"
resource = "main-db"
whenEnabled = true
inject = { DATABASE_URL = "connectionString" }
```

Fields:

- `service`
  Target service id.
- `resource`
  Target resource id.
- `whenEnabled`
  Whether the binding only applies when the resource is enabled.
- `inject`
  Map of environment variable names to resource output names.

Current defaults:

- `whenEnabled = true`

Current validation:

- binding service must exist
- binding resource must exist

Intended meaning:

- bindings are how managed resources become runtime configuration
- bindings are optional wiring, not global assumptions

Example interpretation:

```toml
inject = { DATABASE_URL = "connectionString" }
```

means:

- the service wants `DATABASE_URL`
- if the resource is available, inject the resource’s `connectionString` value into that env var

## `[environments.<name>]`

Environments describe named runtime environments such as development or production.

Example:

```toml
[environments.development]
domain = "localhost"

[environments.development.env]
LOG_LEVEL = "debug"

[environments.production]
domain = "app.example.com"

[environments.production.env]
LOG_LEVEL = "info"
```

Fields:

- `domain`
  Optional environment-level domain.
- `env`
  Optional environment-scoped non-secret env vars.

Current defaults:

- every environment defaults to `env = {}`

Current validation:

- `deployment.defaultEnvironment` must point to a defined environment

Intended meaning:

- environments provide named planning contexts
- they are the right place for environment-wide non-secret settings
- they are not a substitute for secret management

## How environment variables combine

The planner currently merges environment variables in this order:

1. artifact env
2. environment env
3. service env

Later entries override earlier ones.

That means service env is the most specific runtime layer.

## Secrets vs env vars

This distinction matters a lot.

Use `env` for:

- stable non-secret config
- defaults
- runtime flags
- public base paths

Use `secrets` for:

- database URLs
- JWT secrets
- API tokens
- provider credentials

Do not put secrets under `[artifacts.env]`, `[services.env]`, or `[environments.<name>.env]`.

## Minimal single-app example

```toml
version = 1

[project]
id = "hello-http"
name = "Hello HTTP"

[runtime]
modules = ["nodejs-24"]

[deployment]
defaultEnvironment = "development"

[[artifacts]]
id = "api"
kind = "server"
path = "services/api"

[artifacts.build]
command = "pnpm build"
outputDir = "dist"

[[services]]
id = "api-http"
artifact = "api"
kind = "http"
public = true
secrets = ["DATABASE_URL"]

[services.run]
command = "node ./dist/index.js"
port = 3000

[[routes]]
service = "api-http"
path = "/"
stripPrefix = false

[environments.development]
domain = "localhost"
```

This is the smallest useful pattern for a single buildable and runnable service.

## Multi-artifact workspace example

```toml
version = 1

[project]
id = "open-studio"
name = "Open Studio"

[runtime]
modules = ["nodejs-24"]

[deployment]
target = "autoscale"
router = "application"
defaultEnvironment = "development"

[[artifacts]]
id = "landing"
kind = "web"
path = "apps/landing"

[artifacts.build]
command = "pnpm --filter @workspace/landing run build"
outputDir = "dist"

[[artifacts]]
id = "api"
kind = "server"
path = "services/api"

[artifacts.build]
command = "pnpm --filter @workspace/api run build"
outputDir = "dist"

[[services]]
id = "landing-web"
artifact = "landing"
kind = "static"
public = true

[services.static]
publicDir = "dist"
spa = true
indexFile = "index.html"

[[routes]]
service = "landing-web"
path = "/"
stripPrefix = false

[[services]]
id = "api-http"
artifact = "api"
kind = "http"
public = true
secrets = ["DATABASE_URL", "JWT_SECRET"]

[services.run]
command = "node ./dist/index.js"
port = 3000

[[routes]]
service = "api-http"
path = "/api/"
stripPrefix = true

[environments.development]
domain = "localhost"
```

This pattern scales from a single app to a workspace without changing the core model.

## External database example

When the database is external, the service should just declare the secret it needs:

```toml
[[services]]
id = "api-http"
artifact = "api"
kind = "http"
public = true
secrets = ["DATABASE_URL", "JWT_SECRET"]
```

No managed resource is required.

This is how the spec stays platform-agnostic.

## Managed resource example

When the platform manages the resource, add `resources` and `bindings`:

```toml
[[resources]]
id = "main-db"
kind = "postgres"
mode = "managed"
version = "16"
enabled = true

[resources.config]
database = "app"
username = "app"

[[bindings]]
service = "api-http"
resource = "main-db"
whenEnabled = true
inject = { DATABASE_URL = "connectionString" }
```

This does not replace `secrets`.

The service still declares what it needs. The binding explains how the platform can satisfy that need when a managed resource exists.

## Current validation summary

The current package enforces these core rules:

- supported `version`
- at least one artifact
- at least one service
- unique artifact ids
- unique service ids
- unique resource ids
- artifact must define `build.command`, `dev.command`, or both
- service must reference a real artifact
- route must reference a real service
- route path must start with `/`
- binding must reference a real service
- binding must reference a real resource
- `static` services must define `[services.static]`
- only `static` services may define `[services.static]`
- `http` services must define a runtime port
- `deployment.defaultEnvironment` must exist

## What the current spec does not model first-class yet

The current model is intentionally focused and not universal yet.

It does not yet have first-class support for:

- cron schedules
- one-off jobs
- service scaling hints
- explicit build graph dependencies between artifacts
- volumes and mounts
- sidecars
- traffic weighting and canaries
- TCP/UDP exposure

Those may be added later, but they are intentionally not baked into `version = 1`.

## Naming guidance

Good ids are:

- stable
- short
- machine-friendly
- descriptive

Examples:

- `api`
- `landing`
- `admin`
- `api-http`
- `landing-web`
- `main-db`

Avoid ids that encode temporary implementation details like:

- `ecs-api-task`
- `docker-compose-postgres`
- `k8s-service-1`

The spec should outlive those adapter choices.

## Recommended authoring style

To keep specs maintainable:

- keep artifact ids stable
- keep service ids stable
- declare secrets explicitly
- use resources only for platform-managed infrastructure
- keep environment overrides small
- keep routes explicit and readable
- avoid adapter-specific naming in the core spec

## Related docs

- [Architecture](./architecture.md)
- [Usage Guide](./usage-guide.md)
- [Boundary and Ownership](./boundary-and-ownership.md)
- [Public API Reference](./public-api-reference.md)
