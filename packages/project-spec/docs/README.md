# Project Spec Package

`@pytholit/project-spec` is the spec-first foundation for describing runnable user projects in Pytholit.

It defines a durable TOML-based project model, validates it, normalizes it, and turns it into adapter-friendly plans.

The standard manifest filename is `pytholit.toml`.

## Goals

- make the project spec the source of truth
- keep build concepts and runtime concepts separate
- keep routes first-class
- support single-app and workspace-style projects with one model
- support external secrets and optional managed resources without assuming local containers
- keep Docker, Compose, ECS, and Kubernetes at the adapter edge

## Contents

- [TOML Spec Reference](./toml-spec-reference.md)
- [Architecture](./architecture.md)
- [Usage Guide](./usage-guide.md)
- [Public API Reference](./public-api-reference.md)
- [Boundary and Ownership](./boundary-and-ownership.md)

## Core Flow

1. Parse TOML into a raw object
2. Normalize defaults into a stable internal `ProjectSpec`
3. Validate references and invariants
4. Generate `BuildPlan`, `RuntimePlan`, and `RoutePlan`
5. Hand plans to adapters

## Start Here

If you want to understand the manifest format itself, read [TOML Spec Reference](./toml-spec-reference.md) first.

If you want to understand why the package is structured this way, read [Architecture](./architecture.md).

## Examples

- `examples/single-app.toml`
- `examples/workspace-multi-artifact.toml`
- `examples/external-database-url.toml`
- `examples/managed-postgres.toml`

## Template Convention

The repository-level starter templates live under [templates](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/templates).

Each template keeps its manifest at:

- `<template>/pytholit.toml`
