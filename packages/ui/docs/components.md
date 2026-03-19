# @pytholit/ui — Design System Documentation

> **Version**: 1.0.0 · **React**: ^19 · **Tailwind**: v4 · **Framework-agnostic**

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Design Tokens](#design-tokens)
3. [UI Primitives](#ui-primitives)
   - [Button](#button)
   - [Input](#input)
   - [Modal](#modal)
   - [Card](#card)
   - [Badge](#badge)
   - [Skeleton](#skeleton)
   - [DynamicSkeleton](#dynamicskeleton)
4. [Block Components](#block-components)
   - [DashboardTabs](#dashboardtabs)
   - [FilterTabButton](#filtertabbutton)
   - [SectionHeader](#sectionheader)
   - [EmptyState](#emptystate)
   - [LoadingState](#loadingstate)
   - [ErrorBoundary](#errorboundary)
   - [Cards](#cards)
   - [Effects](#effects)
5. [Motion System](#motion-system)
6. [Utilities](#utilities)
7. [CSS Utilities](#css-utilities)
8. [Contributor Guide](#contributor-guide)

---

## Getting Started

### Install / consume from monorepo

```ts
// In any app's package.json
"@pytholit/ui": "workspace:*"
```

### Import styles once at your app root

```ts
import '@pytholit/ui/styles';
```

> This imports `theme.css → base.css → animations.css → utilities.css` in order.

### Usage

```tsx
import { Button, Input, Modal, Badge } from '@pytholit/ui';
import { MotionFade } from '@pytholit/ui';
import { cn } from '@pytholit/ui';
```

---

## Design Tokens

All tokens live in `src/styles/theme.css` inside a `@theme` block (Tailwind v4) and a mirrored `:root` block (for plain CSS `var()` usage).

### Color Tokens

| Token | Value | When to use |
|---|---|---|
| `--color-bg-app` | `#1e1e1e` | Root page background |
| `--color-bg-panel` | `#252526` | Card/panel backgrounds |
| `--color-bg-surface` | `#2d2d2d` | Input/form surface |
| `--color-bg-overlay` | `rgba(0,0,0,0.8)` | Modal/drawer backdrops |
| `--color-border-default` | `#4a4a4a` | Standard borders |
| `--color-border-dim` | `#363636` | Subtle/dim borders |
| `--color-border-highlight` | `#7c3aed` | Focused/active borders |
| `--color-text-primary` | `#d4d4d4` | Body text |
| `--color-text-secondary` | `#9da5b4` | Muted/label text |
| `--color-brand-primary` | `#6d28d9` | Primary actions, buttons |
| `--color-brand-accent` | `#4ec9b0` | Success highlights |
| `--color-brand-neon` | `#a855f7` | Hover/active states for primary |
| `--color-state-success` | `#4ec9b0` | Success states |
| `--color-state-warning` | `#facc15` | Warning states |
| `--color-state-error` | `#ef4444` | Error states |
| `--color-state-info` | `#60a5fa` | Informational |

### Raw Palette (avoid in components)

| Token | Value |
|---|---|
| `--color-nexus-black` | `#1e1e1e` |
| `--color-nexus-dark` | `#252526` |
| `--color-nexus-gray` | `#3c3c3c` |
| `--color-nexus-muted` | `#9da5b4` |
| `--color-nexus-neon` | `#a855f7` |
| `--color-nexus-purple` | `#6d28d9` |
| `--color-nexus-accent` | `#4ec9b0` |

> Use raw palette tokens only inside `theme.css` or `utilities.css`. In components, always use semantic tokens.

### Typography

| Token | Value |
|---|---|
| `--font-mono` | `'JetBrains Mono', monospace` |
| `--font-sans` | `'Space Grotesk', sans-serif` |

```tsx
<span className="font-mono text-xs">code-style label</span>
<h1 className="font-sans text-4xl font-bold">Heading</h1>
```

### Spacing / Radius

| Token | Value |
|---|---|
| `--radius-sm` | `2px` |
| `--radius-md` | `4px` |
| `--radius-lg` | `8px` |

---

## UI Primitives

> Stored in `src/components/ui/`. Generic, framework-agnostic building blocks.

---

### Button

`src/components/ui/Button.tsx`

Built with **class-variance-authority (CVA)** + **`@radix-ui/react-slot`**.

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | Visual style |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Padding/font size |
| `isLoading` | `boolean` | `false` | Shows spinner, disables button |
| `fullWidth` | `boolean` | `false` | Stretches to container width |
| `asChild` | `boolean` | `false` | Renders children element with Button styles |
| `disabled` | `boolean` | — | Native disabled attribute |

All native `<button>` HTML attributes are forwarded. `type` defaults to `"button"` to prevent accidental form submission.

#### Examples

```tsx
// Primary (default) — has the offset shadow animation
<Button>Deploy</Button>

// Secondary — glass-style bordered
<Button variant="secondary" size="lg">Cancel</Button>

// Ghost — transparent, subtle
<Button variant="ghost">View details</Button>

// Danger — red, confirms destructive actions
<Button variant="danger">Delete project</Button>

// Loading — spinner + disabled
<Button isLoading>Saving...</Button>

// Full width
<Button fullWidth>Connect account</Button>

// asChild — renders an <a> with Button styles (no wrapper needed)
<Button asChild variant="secondary">
  <a href="/docs" target="_blank">Open docs ↗</a>
</Button>

// asChild with React Router Link
<Button asChild>
  <Link to="/dashboard">Go to dashboard</Link>
</Button>
```

#### Notes

- The `primary` variant uses a CSS offset-shadow animation defined in `utilities.css` (`.nexus-shadow-btn-wrapper`).
- When `asChild={true}` and `variant="primary"`, the shadow wrapper is skipped to avoid invalid DOM nesting.
- Supports `ref` forwarding to `HTMLButtonElement`.

---

### Input

`src/components/ui/Input.tsx`

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'default' \| 'panel' \| 'ide' \| 'terminal'` | `'default'` | Surface style |
| `intent` | `'default' \| 'brand' \| 'danger'` | `'default'` | Focus ring color |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Padding/font size |
| `multiline` | `boolean` | `false` | Renders a `<textarea>` |
| `rows` | `number` | `3` | Textarea rows (when `multiline`) |
| `label` | `ReactNode` | — | Label rendered above the field |
| `hint` | `ReactNode` | — | Helper text shown below the field |
| `error` | `boolean` | — | Red border + `aria-invalid` |
| `errorMessage` | `ReactNode` | — | Error text (replaces `hint`) |

All native `<input>` attributes are forwarded. Supply `id` to get correct `htmlFor` on the label and `aria-describedby` linking.

#### Variants

| Variant | Description |
|---|---|
| `default` | `bg-bg-surface` — standard form fields |
| `panel` | `bg-bg-panel` — inputs inside dark panels |
| `ide` | `bg-bg-app` — darker, IDE-like inputs |
| `terminal` | No border, transparent — inline terminal commands |

#### Examples

```tsx
// Bare input — returns just <input>, no wrapper
<Input placeholder="Enter value" />

// Full field with label + hint
<Input
  id="project-name"
  label="Project Name"
  hint="Only lowercase letters, numbers, and hyphens."
  placeholder="my-project"
/>

// Validation error
<Input
  id="email"
  label="Email"
  error={!!errors.email}
  errorMessage={errors.email?.message}
  type="email"
/>

// Textarea
<Input
  id="description"
  label="Description"
  multiline
  rows={4}
  placeholder="Describe your project..."
/>

// IDE-style
<Input variant="ide" placeholder="$ custom command" />

// Intent focus ring
<Input intent="brand" placeholder="Focus me" />
```

---

### Modal

`src/components/ui/Modal.tsx`

Built on **`@radix-ui/react-dialog`**. Radix handles focus-trapping, ESC key, scroll-lock, ARIA roles, and portal rendering automatically.

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `isOpen` | `boolean` | — | Controls visibility |
| `onClose` | `() => void` | — | Called when modal should close |
| `title` | `string` | — | Title displayed in the header |
| `variant` | `'default' \| 'wide' \| 'fullscreen'` | `'default'` | Width preset |
| `isLoading` | `boolean` | `false` | Disables close button and ESC |
| `className` | `string` | — | Additional classes for the panel |

#### Variants

| Variant | Max Width |
|---|---|
| `default` | `max-w-md` |
| `wide` | `max-w-2xl` |
| `fullscreen` | `max-w-6xl`, `h-[90vh]` |

#### Examples

```tsx
// Basic confirm dialog
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Delete</Button>

<Modal isOpen={open} onClose={() => setOpen(false)} title="CONFIRM DELETE">
  <p className="text-text-secondary text-sm">
    This action cannot be undone.
  </p>
  <div className="flex gap-3 justify-end mt-6">
    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="danger" onClick={() => setOpen(false)}>Delete</Button>
  </div>
</Modal>

// Wide variant for forms
<Modal isOpen={open} onClose={() => setOpen(false)} title="CREATE PROJECT" variant="wide">
  <Input id="name" label="Project name" />
  <div className="flex justify-end mt-6">
    <Button>Create</Button>
  </div>
</Modal>

// Prevent close while submitting
<Modal isOpen={open} onClose={() => setOpen(false)} isLoading={isSubmitting}>
  ...
</Modal>
```

---

### Card

`src/components/ui/Card.tsx`

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'default' \| 'glass' \| 'interactive'` | `'default'` | Visual style |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Internal padding |

#### Examples

```tsx
<Card>Default bordered panel</Card>

<Card variant="glass">Frosted glass with backdrop blur</Card>

<Card variant="interactive" onClick={handleClick}>
  Highlights on hover
</Card>

<Card padding="none">Full-bleed image goes here</Card>
```

---

### Badge

`src/components/ui/Badge.tsx`

Monospace, uppercase, tiny labels. Includes pre-built status variants for the Pytholit platform.

#### Variants

| Variant | Colors |
|---|---|
| `success` | `brand-accent` (teal) |
| `warning` | `yellow-400` |
| `error` | `red-500` |
| `muted` | `text-secondary` |
| `purple` | `brand-primary` |

#### Exports

| Component | Description |
|---|---|
| `<Badge>` | Generic badge with `variant` and optional `icon` |
| `<StatusBadge status={ProjectStatus}>` | Project running / stopped / building / error |
| `<DeploymentStatusBadge status={DeploymentStatus}>` | live / stopped / deploying / failed |
| `<DeployJobStatusBadge status={DeployJobStatus}>` | queued / running / succeeded / failed / canceled |

#### Examples

```tsx
<Badge variant="success">Live</Badge>
<Badge variant="error" icon={<AlertCircle size={10} />}>Failed</Badge>

<StatusBadge status="running" />
<DeploymentStatusBadge status="deploying" />
<DeployJobStatusBadge status="succeeded" />
```

---

### Skeleton

`src/components/ui/Skeleton.tsx`

Animated loading placeholder.

```tsx
// Simple
<Skeleton className="h-4 w-48" />
<Skeleton className="h-32 w-full" />

// With explicit style
<Skeleton style={{ height: 80, width: '100%' }} />
```

---

### DynamicSkeleton

`src/components/ui/DynamicSkeleton.tsx`

Context-driven skeleton system — wraps a subtree and replaces `<DynamicValue>` content with `<DynamicSlot>` skeletons while loading.

#### Exports

| Export | Description |
|---|---|
| `<DynamicSkeletonProvider loading>` | Context provider |
| `<DynamicSlot>` | The skeleton shape shown while loading |
| `<DynamicValue>` | The real content shown when loaded |
| `useDynamicSkeletonLoading()` | Returns current `loading` state from context |

#### Example

```tsx
<DynamicSkeletonProvider loading={isFetching}>
  <div>
    <DynamicSlot><Skeleton className="h-5 w-32" /></DynamicSlot>
    <DynamicValue><h2>{project.name}</h2></DynamicValue>

    <DynamicSlot><Skeleton className="h-4 w-64 mt-2" /></DynamicSlot>
    <DynamicValue><p>{project.description}</p></DynamicValue>
  </div>
</DynamicSkeletonProvider>
```

---

## Block Components

> Stored in `src/components/blocks/`. Composite components that compose primitives or carry product-specific data shapes.

---

### DashboardTabs

`src/components/blocks/DashboardTabs.tsx`

Tab/filter bar used across dashboard pages.

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `tabs` | `DashboardTab[]` | — | Tab definitions (`value`, `label`, optional `icon`) |
| `active` | `string` | — | Currently active tab value |
| `onChange` | `(value: string) => void` | — | Called on tab click |
| `size` | `'small' \| 'large'` | `'small'` | Size preset |

#### Example

```tsx
import { Server, Globe } from 'lucide-react';

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'api', label: 'API', icon: Server },
  { value: 'web', label: 'Web', icon: Globe },
];

<DashboardTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

// Large variant for landing pages
<DashboardTabs tabs={TABS} active={activeTab} onChange={setActiveTab} size="large" />
```

---

### FilterTabButton

`src/components/blocks/FilterTabButton.tsx`

A single styled filter tab button — use when you need more direct control than `DashboardTabs`.

```tsx
<FilterTabButton active={filter === 'all'} onClick={() => setFilter('all')}>
  All
</FilterTabButton>

<FilterTabButton active={filter === 'running'} onClick={() => setFilter('running')} icon={Zap}>
  Running
</FilterTabButton>
```

---

### SectionHeader

`src/components/blocks/SectionHeader.tsx`

Marketing/landing page section header with optional badge, icon, title (`<h1>`), and subtitle.

```tsx
<SectionHeader
  badge="OPEN SOURCE"
  icon={GitBranch}
  title={<>Build <span className="text-brand-primary">faster</span></>}
  subtitle="Deploy Python apps with zero configuration."
/>
```

---

### EmptyState

`src/components/blocks/states/EmptyState.tsx`

Standardized empty/no-results panel.

```tsx
<EmptyState message="No deployments found." />
<EmptyState message="No results match your filters." className="mt-4" />
```

---

### LoadingState

`src/components/blocks/states/LoadingState.tsx`

Standardized in-page loading panel.

```tsx
<LoadingState />                              // "Loading..."
<LoadingState message="Fetching logs..." />
```

---

### ErrorBoundary

`src/components/blocks/common/ErrorBoundary.tsx`

React class-based error boundary. Renders a fallback UI with error message and a retry button.

```tsx
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

---

### Cards

#### BaseInteractiveCard

`src/components/blocks/cards/BaseInteractiveCard.tsx`

Flexible card layout with top bar (badges left, actions right) and main content area. Used as the building block for all other specialized cards.

```tsx
<BaseInteractiveCard
  topBarLeft={<Badge variant="success">Live</Badge>}
  topBarRight={<Button variant="ghost" size="sm">Edit</Button>}
>
  <p>Card content</p>
</BaseInteractiveCard>
```

#### FeatureCard

Displays a feature with icon, title, and description. Props come from the `Feature` contract type.

#### PricingCard

Pricing plan display. Props come from the `PricingPlan` contract type (name, price, features, CTA).

#### ResourceCard

Hub resource display. Props from `HubResource` (title, description, stars, author, tags).

#### TemplateCard

Project template display. Props from `Template` (name, description, tags, use button, star count).

---

### Effects

Visual/decorative components — generally placed in backgrounds or hero sections.

| Component | Description |
|---|---|
| `<BackgroundLayers>` | Stacked z-index background panels |
| `<CyberRings>` | Animated concentric ring decoration |
| `<LivingGrid>` | Animated grid pattern background |
| `<GlitchText>` | Text with CSS glitch animation |

---

## Motion System

> Stored in `src/motion/`. Abstraction layer over **Framer Motion / `motion`**.

All primitives respect `prefers-reduced-motion` — they fall back to a simple fade when the OS setting is active.

### Primitives

#### `<MotionFade>`

Fades in on mount.

```tsx
<MotionFade>Content</MotionFade>

// Scroll-triggered (once)
<MotionFade once delay={0.1}>Appears when scrolled into view</MotionFade>

// On any HTML element
<MotionFade as="section" className="grid">...</MotionFade>
```

#### `<MotionSlideIn>`

Slides and fades in.

```tsx
// Default: slides up
<MotionSlideIn>Card</MotionSlideIn>

// Slide from right
<MotionSlideIn direction="right">Sidebar</MotionSlideIn>

// Custom distance (px)
<MotionSlideIn distance={32} delay={0.2}>...</MotionSlideIn>
```

#### `<MotionScaleIn>`

Scales up from slightly smaller.

```tsx
<MotionScaleIn>Modal panel</MotionScaleIn>
```

#### `<MotionStagger>`

Wraps children and staggers their entrance animations.

```tsx
<MotionStagger as="ul" stagger={0.06} delayChildren={0.1}>
  <MotionSlideIn as="li">Item 1</MotionSlideIn>
  <MotionSlideIn as="li">Item 2</MotionSlideIn>
  <MotionSlideIn as="li">Item 3</MotionSlideIn>
</MotionStagger>
```

#### `<PageTransition>`

Wraps page-level content for route change animations.

```tsx
<PageTransition>
  <DashboardPage />
</PageTransition>
```

#### `<MotionPopover>`

Slide-up reveal for tooltips and overlays. Supports `ref`.

#### `<MotionBackdrop>`

Fade-in backdrop overlay for modals/drawers.

#### `<Presence>`

Re-export of Framer Motion's `<AnimatePresence>`. Wrap conditionally-rendered animated elements.

```tsx
<Presence>
  {isOpen && <MotionScaleIn key="panel">...</MotionScaleIn>}
</Presence>
```

### Animation Tokens

```ts
import { MOTION_DURATION, MOTION_EASE, MOTION_DISTANCE } from '@pytholit/ui';

MOTION_DURATION.fast   // 0.18s
MOTION_DURATION.base   // 0.28s
MOTION_DURATION.slow   // 0.42s

MOTION_EASE.standard   // [0.16, 1, 0.3, 1]  — springy
MOTION_EASE.smooth     // [0.22, 1, 0.36, 1]  — very smooth
MOTION_EASE.crisp      // [0.2, 0.8, 0.2, 1]  — snappy

MOTION_DISTANCE.sm     // 8px
MOTION_DISTANCE.md     // 16px
MOTION_DISTANCE.lg     // 24px
```

### Variant Functions

Raw variant objects for custom `motion` components:

```ts
import {
  fadeVariants,
  slideUpVariants,
  slideRightVariants,
  scaleInVariants,
  staggerContainerVariants,
} from '@pytholit/ui';
```

---

## Utilities

### `cn(...inputs)`

Merges Tailwind classes intelligently (via `clsx` + `tailwind-merge`). Always use this instead of string concatenation.

```ts
import { cn } from '@pytholit/ui';

cn('px-4 py-2', isActive && 'bg-brand-primary', className)
// → 'px-4 py-2 bg-brand-primary my-custom-class'

// Overrides work correctly:
cn('p-4 p-2') // → 'p-2'
cn('text-red-500', 'text-blue-500') // → 'text-blue-500'
```

---

## CSS Utilities

Available globally after importing `@pytholit/ui/styles`.

### Shadows

| Class | Effect |
|---|---|
| `.nexus-shadow` | Static 8px offset shadow in `brand-primary` |
| `.nexus-shadow-hover` | Offset shadow that appears on hover |
| `.nexus-shadow-btn-wrapper` + `.nexus-shadow-btn` | Animated button shadow effect used by `<Button variant="primary">` |

### Borders

| Class | Effect |
|---|---|
| `.brutal-border` | 1px border in `border-default` |
| `.brutal-border-thick` | 2px border in `border-default` |

### Scrollbars

| Class | Effect |
|---|---|
| `.custom-scrollbar` | 6px styled vertical scrollbar |
| `.editor-tabs-scroll` | 5px horizontal scrollbar for tab bars |
| `.hide-scrollbar` | Hides scrollbar while keeping scroll |

### Glass

| Class | Effect |
|---|---|
| `.glass-panel` | Semi-transparent `bg-panel` + `backdrop-blur-12px` |

---

## Contributor Guide

### Adding a UI Primitive

1. Create `src/components/ui/MyComponent.tsx`
2. Use CVA for variants:

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const myVariants = cva('base-classes', {
  variants: {
    variant: { primary: '...', secondary: '...' },
    size:    { sm: '...', md: '...', lg: '...' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});

export interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof myVariants> {}

export const MyComponent = ({ className, variant, size, ...props }: MyComponentProps) => (
  <div className={cn(myVariants({ variant, size }), className)} {...props} />
);
```

3. For interactive/accessible components, use Radix:

```tsx
import * as Tooltip from '@radix-ui/react-tooltip';

// Radix provides: keyboard nav, focus management, ARIA roles, portal
```

4. Export from `src/components/ui/index.ts`
5. Write a `.stories.tsx` file for Storybook
6. Write a `.test.tsx` file for Vitest

### Adding a Block Component

Same as above but in `src/components/blocks/` (or a subdirectory). Block components:
- May import from `src/components/ui/`
- May use `@pytholit/contracts` types
- Export from `src/components/blocks/index.ts`

### Token Rule

| You are writing... | Use... |
|---|---|
| A component class | Semantic token: `bg-bg-panel`, `text-text-secondary` |
| A CSS utility class | May use raw: `var(--color-nexus-gray)` |
| `theme.css` itself | Raw hex values |

**Never** use: `text-white`, `bg-[#0d0d0d]`, `text-gray-400` in components.

### Commands

```bash
pnpm dev          # Build in watch mode
pnpm build        # Production build (ESM + CJS + .d.ts)
pnpm type-check   # TypeScript strict check
pnpm lint         # ESLint
pnpm test         # Vitest (one-shot)
pnpm test:watch   # Vitest interactive
pnpm test:ui      # Vitest browser UI
pnpm storybook    # Component explorer (requires Node 20.19+)
```

### Creating a Changeset (for releases)

When your PR includes a user-facing change:

```bash
pnpm changeset
# Select packages changed, type (major/minor/patch), write a description
# This creates a .changeset/xxx.md file — commit it with your PR
```

On merge to `main`, run:
```bash
pnpm changeset:version  # bumps versions + writes CHANGELOG.md
pnpm changeset:publish  # publishes to npm
```
