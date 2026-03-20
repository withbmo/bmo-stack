# Contributing To `@pytholit/ui`

Use this checklist before promoting UI into the shared design-system package.

## Placement Rules

Put something in `ui` when:

- the API is generic and domain-neutral
- it solves a shared interaction or styling problem
- it should be stable across unrelated screens

Put something in `blocks` when:

- it composes existing primitives
- it is reused across multiple product areas
- it expresses a shared branded or product-facing pattern

Keep something in app code when:

- it is route-specific or feature-coupled
- it owns business logic or server-data shape assumptions
- reuse is still speculative

## Export Checklist

Before a new shared export lands, it should:

- use semantic design-system tokens instead of raw palette values
- have Storybook coverage for intended usage
- have tests when interaction behavior matters
- use the canonical import boundaries: `@pytholit/ui/ui` and `@pytholit/ui/blocks`
- avoid hidden side effects like internal navigation or feature-only state coupling

## API Expectations

- Primitives should use stable, generic names like `Button`, `FormField`, or `Select`.
- Blocks may use product vocabulary when the pattern is genuinely shared.
- Internal helpers like `Base*` utilities should stay private unless they become real public contracts.

## Deprecation Policy

- Prefer adding the better API first, then migrating consumers.
- Remove compatibility aliases once active consumers are gone.
- Keep `@pytholit/ui` as compatibility-only; new code should use subpath imports.
