# Architecture

## Why this package exists

The existing codebase already has:

- project CRUD metadata
- wizard-driven file generation
- deploy-job state tracking
- concrete infrastructure adapters such as Terraform and Docker Compose

What it did not have was a durable internal model for "what a user project is".

This package fills that gap.

## Layering

The architecture is intentionally split into four layers:

### 1. Spec

Stable domain model:

- `ProjectSpec`
- `RuntimeSpec`
- `DeploymentSpec`
- `ArtifactSpec`
- `ServiceSpec`
- `RouteSpec`
- `ResourceSpec`
- `BindingSpec`
- `EnvironmentSpec`

### 2. Validation

The parser accepts TOML or object input and resolves:

- defaults
- shape validation
- cross-reference checks
- durable invariants

### 3. Planning

The planner derives:

- `BuildPlan`
- `RuntimePlan`
- `RoutePlan`

These plans are normalized operational views, but they are still infrastructure-agnostic.

### 4. Adapters

Adapters compile plans into concrete targets such as:

- Dockerfiles
- Docker Compose
- ECS task/service inputs
- Kubernetes manifests
- local dev process startup
- ingress/router config

## Core design rules

### Artifact is not service

Artifacts describe what can be built.

Services describe what actually runs.

One artifact may back multiple services later, and a service may inherit defaults from its artifact without collapsing the concepts together.

### Routes are first-class

Routes are not embedded into service startup behavior.

This keeps ingress, preview, path routing, host routing, and future gateway logic composable.

### Resources are optional

Resources model platform-managed infrastructure when the platform provides it.

Secrets model service requirements regardless of whether the platform manages the backing system.

That separation lets a service work with Supabase, Neon, RDS, Redis Cloud, or an internal managed database without rewriting the service model.

### Plans are the adapter boundary

Adapters should not reinterpret raw TOML directly.

They consume normalized plans so the domain stays stable even when deployment targets change.
