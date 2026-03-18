# Usage Guide

For a full explanation of the TOML language itself, including every block and field, read [TOML Spec Reference](./toml-spec-reference.md).

## Parse and validate

```ts
import { parseProjectSpec, validateProjectSpec } from '@pytholit/project-spec';

const spec = validateProjectSpec(parseProjectSpec(tomlSource));
```

## Generate plans

```ts
import { createProjectPlans } from '@pytholit/project-spec';

const { buildPlan, runtimePlan, routePlan } = createProjectPlans(spec, 'production');
```

## Suggested integration pattern

Use this package in application code in this order:

1. load project spec content
2. parse and validate it
3. persist or cache the normalized result if needed
4. generate plans for the requested environment
5. pass plans to a concrete adapter

## Recommended reading order

1. [TOML Spec Reference](./toml-spec-reference.md)
2. [Architecture](./architecture.md)
3. this usage guide

## Backward compatibility strategy

The existing wizard can continue generating starter files while this package becomes the durable runtime spec layer.

A later migration can teach the wizard to emit a `project.toml` file as part of generation instead of making Docker/Compose files the main long-term source of truth.
