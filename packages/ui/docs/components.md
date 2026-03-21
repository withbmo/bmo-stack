# @pytholit/ui Components

This document describes the current package surface, not every possible future component.

## Imports

Preferred import style:

- `@pytholit/ui/ui` for primitives, motion, and helpers
- `@pytholit/ui/blocks` for shared compositions
- `@pytholit/ui/system` for shared behavioral and pattern utilities
- avoid `@pytholit/ui` in new code; it remains compatibility-only

```ts
import '@pytholit/ui/styles';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  type BadgeProps,
  type BadgeVariant,
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  FormField,
  Input,
  Modal,
  MotionFade,
  MotionScaleIn,
  MotionSlideIn,
  MotionStagger,
  PageTransition,
  Popover,
  PopoverSection,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  cn,
} from '@pytholit/ui/ui';

import {
  BackgroundLayers,
  CyberRings,
  DashboardTabs,
  EmptyState,
  FilterTabButton,
  GlitchText,
  LivingGrid,
  LoadingState,
  ResourceCard,
  type ResourceCardData,
  type ResourceCardProps,
  SectionHeader,
  TemplateCard,
  type TemplateCardData,
  type TemplateCardProps,
} from '@pytholit/ui/blocks';

import {
  DynamicSkeletonProvider,
  DynamicSlot,
  DynamicValue,
  Toaster,
  toast,
  useDynamicSkeletonLoading,
} from '@pytholit/ui/system';
```

For type-only imports, prefer an explicit `type` import:

```ts
import type { BadgeProps, BadgeVariant } from '@pytholit/ui/ui';
import type { TemplateCardData } from '@pytholit/ui/blocks';
```

## Primitives

### Button

Use for generic actions and navigational affordances.

- Native source: shadcn-generated button hosted in `packages/ui`
- Variants: `default`, `secondary`, `outline`, `ghost`, `link`, `destructive`
- Sizes: `default`, `sm`, `lg`, `icon`
- Shared behaviors:
  - `asChild`
  - native composition for loading states
  - width controlled via standard `className`
- Accessibility notes:
  - defaults `type="button"`
  - composes cleanly with links and icons

### Input

Use for generic text entry and textarea needs.

- Variants: `default`, `panel`, `ide`, `terminal`
- Intents: `default`, `brand`, `danger`
- Supports:
  - `label`
  - `hint`
  - `errorMessage`
  - `multiline`
- Accessibility notes:
  - sets `aria-invalid`
  - wires `aria-describedby` when hint or error copy is present

### FormField

Use for shared form composition around existing primitives.

- standardizes:
  - labels
  - hint copy
  - error copy
  - required markers
- composes with `Input`, `Select`, and other field-like children
- injects `aria-describedby` and `aria-invalid` when the child does not already provide them

### Modal

Use as the canonical shared dialog primitive.

- Built on Radix Dialog
- Supports `default`, `wide`, and `fullscreen`
- Prevents close interactions while `isLoading`
- Handles focus trapping, escape dismissal, portal rendering, and dialog semantics

### Card

Use for generic grouped content containers.

- Variants: `default`, `glass`, `interactive`
- Padding: `none`, `sm`, `md`, `lg`
- Forwards ref and HTML attributes

### Badge

Use for compact status or metadata labels.

- Variants: `success`, `warning`, `error`, `muted`, `purple`
- `Badge` is the only shared primitive export
- product-specific status mapping should live in app code or, if broadly reused, in `blocks`

### Tabs

Use for shared segmented navigation and content switching.

- exports:
  - `Tabs`
  - `TabsList`
  - `TabsTrigger`
- `TabsContent`
- intended for reusable app navigation patterns and block-level wrappers

### Select

Use for shared single-value selection UIs.

- exports:
  - `Select`
  - `SelectTrigger`
  - `SelectContent`
  - `SelectItem`
  - `SelectValue`
- intended for forms, deployment pickers, and lightweight configuration flows

### DropdownMenu

Use for action menus and compact option lists.

- exports:
  - `DropdownMenu`
  - `DropdownMenuTrigger`
  - `DropdownMenuContent`
  - `DropdownMenuItem`
  - `DropdownMenuLabel`
  - `DropdownMenuSeparator`
- intended for toolbar controls, IDE menus, and compact contextual actions

### Accordion

Use for progressive disclosure of structured content.

- exports:
  - `Accordion`
  - `AccordionItem`
  - `AccordionTrigger`
  - `AccordionContent`
- intended for FAQs, settings groups, and collapsible explanation panels

### Popover

Use for lightweight contextual panels.

- supports controlled and uncontrolled open state
- supports `triggerAsChild` for existing primitive triggers
- exports `PopoverSection` for structured content grouping inside the panel
- intended for menus, quick actions, and contextual detail panels

### Tooltip

Use for short, non-essential helper copy.

- supports hover and focus disclosure
- best for icon affordances or compact explanatory hints

### Skeleton

Use for loading placeholders.

- `Skeleton` is the plain visual placeholder primitive

## System

System exports are shared package-owned utilities that coordinate behavior or loading patterns across apps. They are not low-level visual primitives.

### Toast

Use for transient feedback and mutation status.

- exports:
  - `toast`
  - `Toaster`
- import from `@pytholit/ui/system`
- wraps the package-approved notification experience so app code does not import `sonner` directly

### DynamicSkeleton

Use for shared loading-state orchestration around existing UI.

- exports:
  - `DynamicSkeletonProvider`
  - `DynamicSlot`
  - `DynamicValue`
  - `useDynamicSkeletonLoading`
- import from `@pytholit/ui/system`
- intended for coordinated loading swaps rather than plain visual placeholders

## Blocks

Blocks are shared compositions, not app-local layouts.

### Navigation and Structure

- `DashboardTabs`
- `FilterTabButton`
- `SectionHeader`

### Product Cards

- `TemplateCard`
- `ResourceCard`

Notes:

- `TemplateCard` supports `onUseTemplate` for controlled actions and `actionHref` for explicit navigation
- `ResourceCard` currently remains a read-only shared display block because that matches its active consumer shape

### Shared States

- `EmptyState`
- `LoadingState`

### Branded Effects

- `BackgroundLayers`
- `CyberRings`
- `LivingGrid`
- `GlitchText`

## Not in the Design-System Surface

These are intentionally not exported as shared blocks:

- `BaseInteractiveCard`
- `ScrollToHash`
- `ErrorBoundary`
- `FeatureCard`
- `PricingCard`

Reason:

- `BaseInteractiveCard` is an internal implementation helper.
- `ScrollToHash` is app behavior, not reusable design-system UI.
- `ErrorBoundary` is app/system behavior and should live closer to route ownership.
- `FeatureCard` is currently too product-specific and unused as a shared block export.
- `PricingCard` currently has no active shared consumer and should stay out of the public block surface until that changes.

## Migration Status

- prefer `@pytholit/ui/ui` and `@pytholit/ui/blocks` in all new code
- treat `@pytholit/ui` as compatibility-only
- Storybook build output is local generated output and should not be committed

## Motion

Motion is part of the primitive layer because it is cross-cutting infrastructure.

Available helpers:

- `MotionFade`
- `MotionSlideIn`
- `MotionScaleIn`
- `MotionStagger`
- `MotionPopover`
- `MotionBackdrop`
- `PageTransition`
- `Presence`

Available token exports:

- `MOTION_DURATION`
- `MOTION_EASE`
- `MOTION_DISTANCE`

## Utility Classes

Available globally after importing `@pytholit/ui/styles`.

- `offset-shadow`
- `offset-shadow-hover`
- `offset-shadow-button`
- `offset-shadow-button-wrapper`

## Contribution Rules

- Put generic, stable, domain-neutral APIs in `ui`
- Put repeated branded/product compositions in `blocks`
- Keep route-specific behavior in apps
- Add Storybook coverage for every public primitive and shared block
- Add or extend tests for interactive primitives
- Prefer semantic design tokens over raw color names or one-off values
