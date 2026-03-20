# Pytholit Design System

## Vision

`packages/ui` is the internal design system for the monorepo.

It exists to make UI decisions stable, reusable, and well-governed across apps. The package should not become a dumping ground for “shared-ish” components. Every export should reinforce the system.

## Layers

### 1. Foundations

Foundations define the rules the rest of the system builds on:

- semantic color roles
- typography families, sizes, weights, and line heights
- spacing scale
- radius scale
- shadow tokens
- z-index tokens
- motion duration, easing, and distance tokens

Foundations live primarily in `src/styles/`, `src/motion/`, and Storybook foundation stories.

### 2. Primitives

Primitives are generic building blocks:

- they are reusable across unrelated screens
- they avoid product nouns in the API
- they carry stable contracts
- they own shared accessibility and styling behavior

Examples:

- `Button`
- `Input`
- `Modal`
- `Card`
- `Badge`
- `Skeleton`

Canonical import path:

```ts
import { Button, MotionFade, cn } from '@pytholit/ui/ui';
```

### 3. Blocks

Blocks are sanctioned shared compositions built from primitives:

- they may reflect Pytholit product vocabulary
- they may encode repeated visual structure
- they are shared only when reuse is proven across multiple app areas

Examples:

- `SectionHeader`
- `DashboardTabs`
- `TemplateCard`
- `ResourceCard`
- `BackgroundLayers`

Canonical import path:

```ts
import { SectionHeader, TemplateCard } from '@pytholit/ui/blocks';
```

### 4. Guidance

Guidance turns a component library into a real design system:

- Storybook
- README and docs
- naming conventions
- accessibility expectations
- contribution rules
- deprecation rules

## Promotion Rules

Put something in `ui` when:

- the API is generic and domain-neutral
- the behavior should be standardized globally
- the component should be stable for a long time

Put something in `blocks` when:

- it is a repeated product-facing pattern
- it is built from primitives
- reuse is already real, not hypothetical

Keep something in app code when:

- it belongs to one route or feature
- it depends on feature-specific server data
- it owns business logic or route behavior

If a shared component accumulates too many one-off exceptions, it is probably in the wrong layer.

## Naming Rules

- Primitive names should describe interaction or structure: `Button`, `Input`, `Modal`
- Block names may describe shared product meaning: `TemplateCard`, `DashboardTabs`
- Avoid vague names like `CommonCard`, `GenericPanel`, or `BaseThing`
- Internal helpers may use `Base*` naming, but they should not be exported publicly

## Accessibility Expectations

Every interactive primitive should:

- support keyboard operation
- preserve focus visibility
- expose appropriate native semantics or ARIA
- forward refs where consumers need imperative access
- prefer Radix-backed interaction patterns for focus/portal-heavy behavior

Accessibility-heavy primitives should be built on Radix or shadcn-style internals, but the public API remains Pytholit-owned.

## Motion Principles

Motion is part of the primitive layer because it shapes transitions across the whole product.

Rules:

- motion should clarify hierarchy and state changes
- reduced-motion users should get acceptable fallbacks
- transitions should use shared duration, easing, and distance tokens
- blocks should compose motion primitives instead of inventing bespoke animation logic when possible

## Deprecation Rules

- `@pytholit/ui` root exports remain a compatibility surface
- new code should prefer `@pytholit/ui/ui` and `@pytholit/ui/blocks`
- internal helpers should not be re-exported publicly
- behavioral utilities that are not design-system UI should move to app code rather than remain in shared exports

## Current Decisions

- `BaseInteractiveCard` stays internal
- `ScrollToHash` is not part of the public block surface
- `ErrorBoundary` is not part of the public block surface
- motion and `cn` belong to the primitive entrypoint
- shared blocks should expose explicit navigation/action props instead of triggering hidden route side effects internally

## Migration Status

- `@pytholit/ui/ui` and `@pytholit/ui/blocks` are the canonical public entrypoints
- the root `@pytholit/ui` barrel remains compatibility-only
- active app consumers have been moved to the canonical subpaths
- Storybook mirrors the system layers and includes foundation, primitive, block, and motion coverage

## Roadmap

Core primitives that should be added next:

- richer overlay patterns as needed

Blocks trimmed from the shared public surface when reuse is not proven:

- `FeatureCard`
- `PricingCard`

These should follow the same rules:

- stable API
- semantic tokens
- Storybook coverage
- tests for interaction behavior
