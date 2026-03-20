# @pytholit/ui

Pytholit's internal design system package.

It provides four layers:

- Foundations: tokens, styles, motion rules, and shared utilities
- Primitives: generic reusable UI building blocks exported from `@pytholit/ui/ui`
- Blocks: sanctioned shared compositions exported from `@pytholit/ui/blocks`
- Guidance: Storybook, docs, and contribution rules that explain how the system evolves

## Public Entry Points

```ts
import '@pytholit/ui/styles';

import { Button, MotionFade, cn } from '@pytholit/ui/ui';
import { SectionHeader, TemplateCard } from '@pytholit/ui/blocks';
```

`@pytholit/ui` still exists as a compatibility barrel, but new code should prefer the subpath entrypoints because they preserve the architecture.

## Migration Status

- `@pytholit/ui/ui` and `@pytholit/ui/blocks` are the canonical import paths
- app consumers have been migrated away from the root compatibility barrel
- Storybook is structured by `Foundations`, `Primitives`, `Blocks`, and `Motion`
- generated Storybook output is treated as local build output and is ignored in git

## Layer Rules

Add something to `ui` when:

- it is generic across unrelated screens
- it solves a reusable interaction or styling problem
- it can keep a stable API over time

Add something to `blocks` when:

- it is a repeated product-facing composition
- it combines primitives into a recognizable shared pattern
- it is reused across multiple areas of the product

Keep something in app code when:

- it is route-specific or feature-coupled
- its props mirror one page's data shape
- reuse is only speculative

Behavioral utilities like `ScrollToHash` and broad app error boundaries are not design-system blocks. They belong in application code unless they prove to be true package-level primitives.
The same applies to product cards that do not have an active shared consumer; unused exports should move out of the public surface until reuse is proven.

## Package Shape

```text
packages/ui/src/
├── foundations/      # Storybook coverage for tokens and system rules
├── components/
│   ├── ui/           # Primitive design-system components
│   └── blocks/       # Shared product/branded compositions
├── motion/           # Motion primitives, variants, and tokens
├── styles/           # Theme tokens and global CSS entrypoint
├── types/            # Shared UI-facing types
└── utils/            # Low-level helpers such as cn()
```

## Current Primitive Surface

- `Button`
- `Input`
- `Modal`
- `Card`
- `Badge`
- `Tabs`
- `Select`
- `DropdownMenu`
- `Accordion`
- `Popover`
- `Tooltip`
- `Toast`
- `Skeleton`
- `DynamicSkeleton`
- motion primitives
- `cn`

Queued next primitives for the design-system roadmap:

- richer overlay patterns as needed

These should be built on top of Radix or shadcn-style internals while keeping Pytholit-owned APIs and styling.

## Foundations

The required stylesheet entrypoint is:

```ts
import '@pytholit/ui/styles';
```

Foundations currently cover:

- semantic colors for surface, border, text, brand, and state roles
- typography families, scale, weights, and line heights
- spacing and radius scales
- shadow and z-index tokens
- motion duration, easing, and distance tokens

Components should consume semantic tokens like `bg-bg-panel` or `text-state-error` rather than raw palette names.

Shared blocks should also avoid hidden navigation or route side effects. If a block needs to trigger navigation, prefer explicit props like `href`, `actionHref`, or callbacks supplied by the consumer.

## Storybook

Storybook is the visual source of truth and should mirror the design-system layers:

- `Foundations/*`
- `Primitives/*`
- `Blocks/*`
- `Motion/*`

Node must match the repo-supported range before Storybook will run cleanly.

```bash
pnpm storybook
pnpm storybook:build
```

## Local Commands

```bash
pnpm dev
pnpm lint
pnpm type-check
pnpm test
pnpm build
pnpm storybook
```

## Standards

- Prefer semantic tokens over one-off values.
- Use Radix-backed patterns for accessibility-heavy primitives.
- Keep `BaseInteractiveCard` and similar helpers internal.
- Document every public primitive and shared block in Storybook.
- Prefer `@pytholit/ui/ui` and `@pytholit/ui/blocks` in consuming apps.

## Further Docs

- [`docs/design-system.md`](./docs/design-system.md)
- [`docs/components.md`](./docs/components.md)
