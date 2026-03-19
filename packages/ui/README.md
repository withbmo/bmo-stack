# @pytholit/ui

> Pytholit's design system and shared component library.

## Stack

| Tool | Purpose |
|---|---|
| React 19 | Component framework |
| Tailwind CSS | Utility-first styling |
| `class-variance-authority` (CVA) | Type-safe component variants |
| `@radix-ui/react-*` | Accessible UI primitives |
| `motion` (Framer Motion) | Animation primitives |
| `tsup` | Build (ESM + CJS + `.d.ts`) |
| Storybook | Visual component explorer |
| Vitest + RTL | Unit / interaction tests |

---

## Directory Structure

```
packages/ui/src/
├── components/
│   ├── ui/           # Atomic primitives (Button, Input, Modal, Badge, Card…)
│   └── blocks/       # Composite / domain-specific components
│       ├── cards/      # FeatureCard, PricingCard, ResourceCard, TemplateCard
│       ├── common/     # ErrorBoundary, GlitchText, ScrollToHash
│       ├── effects/    # BackgroundLayers, CyberRings, LivingGrid
│       └── states/     # EmptyState, LoadingState
├── motion/           # Shared animation primitives & tokens
├── styles/           # CSS design system (theme, base, animations, utilities)
├── types/            # Shared TypeScript types
└── utils/            # cn() and other helpers
```

**Rule of thumb:**
- A component belongs in `ui/` if it is a generic building-block with no product-specific logic.
- A component belongs in `blocks/` if it composes other components or contains Pytholit-specific data shapes.

---

## Adding a New Component

### 1. Create the file

```
src/components/ui/MyComponent.tsx          # atomic
src/components/blocks/MyBlock.tsx          # composite
```

### 2. Use CVA for variants

All components with multiple visual styles must use `class-variance-authority`:

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const myComponentVariants = cva(
  'base-classes-here',          // always applied
  {
    variants: {
      variant: {
        primary: 'bg-brand-primary text-white',
        secondary: 'bg-transparent border border-border-dim',
      },
      size: {
        sm: 'text-sm px-3 py-1.5',
        md: 'text-base px-4 py-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof myComponentVariants> {}

export const MyComponent = ({ className, variant, size, ...props }: MyComponentProps) => (
  <div className={cn(myComponentVariants({ variant, size }), className)} {...props} />
);
```

### 3. Use Radix UI for interactive / accessible components

For components that require keyboard navigation, focus management, or ARIA roles (dialogs, tooltips, dropdowns, checkboxes…) **always** build on top of a `@radix-ui/react-*` primitive:

```tsx
import * as Dialog from '@radix-ui/react-dialog';

// Radix handles: focus trapping, ESC key, scroll-lock, ARIA roles, portal
export const MyDialog = ({ open, onClose, children }) => (
  <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/70" />
      <Dialog.Content className="fixed inset-0 flex items-center justify-center">
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
```

### 4. Export it

Add the export to the `index.ts` of the relevant subdirectory:

```ts
// src/components/ui/index.ts
export { MyComponent } from './MyComponent';
```

### 5. Write a Story

Create `MyComponent.stories.tsx` next to the component. Storybook will auto-discover it.

---

## Running Locally

```bash
# Build the package (watch mode)
pnpm dev

# Type-check
pnpm type-check

# Lint
pnpm lint

# Storybook (visual explorer)
pnpm storybook
```

---

## Styles

Import the styles once at the root of your consuming application:

```ts
import '@pytholit/ui/styles';
```

The stylesheet is structured as:
1. **`theme.css`** — Design tokens (`--color-brand-primary`, etc.)
2. **`base.css`** — Global resets
3. **`animations.css`** — Keyframe definitions
4. **`utilities.css`** — Custom utility classes

---

## Publishing

This package is an internal workspace package and is not published to npm.
It is consumed locally via `"@pytholit/ui": "workspace:*"` in sibling `apps/`.
