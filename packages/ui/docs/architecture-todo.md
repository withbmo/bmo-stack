# UI Architecture Cleanup Todo

This document tracks the remaining architecture issues found during the UI package audit.

The goal is to keep `packages/ui` as a true design system:

- `ui` for generic primitives
- `blocks` for sanctioned shared compositions
- app code for route-specific or feature-coupled behavior

## 1. Fix Type Ownership Leaks

Problem:

- app and server code still import product-domain types from `@pytholit/ui/ui`
- `packages/ui` currently owns `Template` and `HubResource` shapes in `src/types/index.ts`

Tasks:

- move `Template` out of `packages/ui/src/types/index.ts`
- move `HubResource` out of `packages/ui/src/types/index.ts`
- define app-owned types in `apps/web/src/shared/types` or feature-local view-model files
- update [template-catalog.server.ts](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/apps/web/src/shared/lib/template-catalog.server.ts) to stop importing UI types
- update [TemplatesRoute.tsx](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/apps/web/src/dashboard/features/templates/routes/TemplatesRoute.tsx) to use app/shared types and adapt into `TemplateCard`
- refactor [TemplateCard.tsx](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/packages/ui/src/components/blocks/cards/TemplateCard.tsx) to accept presentation props or a local card prop type
- refactor [ResourceCard.tsx](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/packages/ui/src/components/blocks/cards/ResourceCard.tsx) to accept presentation props or a local card prop type

Priority: High

## 2. Remove UI-Type Coupling From App Constants

Problem:

- app constants currently depend on block prop types from the UI package

Tasks:

- remove `DashboardTab` type dependency from [deploy-job-status.ts](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/apps/web/src/dashboard/features/deployments/constants/deploy-job-status.ts)
- define a local tab item type in the feature layer
- pass tab data structurally into `DashboardTabs` instead of importing a UI block type

Priority: High

## 3. Tighten The Compatibility Barrel

Problem:

- `@pytholit/ui` still exposes a flat compatibility barrel that weakens the `ui` vs `blocks` boundary

Tasks:

- audit [index.ts](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/packages/ui/src/index.ts)
- audit [components/index.ts](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/packages/ui/src/components/index.ts)
- decide whether to:
  - keep them temporarily but mark them as deprecated more explicitly
  - reduce their surface further
  - remove them in a controlled breaking change
- update docs to state that root `@pytholit/ui` is compatibility-only
- add lint or CI enforcement against new root-barrel imports

Priority: Medium

## 4. Reclassify System And Pattern Exports

Problem:

- some exports currently live in `ui` even though they behave more like system or pattern utilities than primitives

Candidates:

- [DynamicSkeleton.tsx](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/packages/ui/src/components/ui/DynamicSkeleton.tsx)
- [Toast.tsx](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/packages/ui/src/components/ui/Toast.tsx)

Tasks:

- decide whether to keep them in `ui` or move them into a clearer `patterns` or `system` layer
- if moved, update exports, docs, Storybook, and app imports

Priority: Medium

## 5. Clean Internal Package Residue

Problem:

- internal-only or non-sanctioned components still live physically inside the design-system package structure, increasing the risk of accidental future re-exports

Files to review:

- [FeatureCard.tsx](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/packages/ui/src/components/blocks/cards/FeatureCard.tsx)
- [PricingCard.tsx](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/packages/ui/src/components/blocks/cards/PricingCard.tsx)
- [ErrorBoundary.tsx](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/packages/ui/src/components/blocks/common/ErrorBoundary.tsx)
- [ScrollToHash.tsx](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/packages/ui/src/components/blocks/common/ScrollToHash.tsx)

Tasks:

- decide whether each file should:
  - move to app code
  - move to a private/internal area
  - remain in place with stronger internal-only structure

Priority: Medium

## 6. Align Storybook With The Public Surface

Problem:

- Storybook does not yet cover every public primitive and shared block even though the docs position it as the source of truth

Tasks:

- add block stories for public exports currently missing coverage:
  - `GlitchText`
  - `BackgroundLayers`
  - `CyberRings`
  - `LivingGrid`
  - `FilterTabButton`
- verify all public primitives and blocks have at least one story
- keep Storybook aligned with actual exports after API changes

Priority: Medium

## 7. Fix Docs Accuracy

Problem:

- docs and README do not fully reflect the actual export surface and Storybook structure

Tasks:

- update [components.md](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/packages/ui/docs/components.md) to reflect the current public exports more completely
- update [README.md](/Users/m7mdhka/Desktop/pytholit/pytholit-v2/packages/ui/README.md) so Storybook structure is described consistently
- fix README wording around `toast` and `Toaster` vs a nonexistent `Toast` component
- ensure docs clearly explain which exports are primitive, block, pattern, or compatibility-only

Priority: Medium

## 8. Add Guardrails

Problem:

- the architecture is documented, but not enforced strongly enough in day-to-day development

Tasks:

- add lint or CI checks to block new `@pytholit/ui` root imports
- add a check or convention against app/server code importing domain types from `packages/ui`
- optionally add a PR checklist for:
  - type ownership
  - correct import path
  - story coverage
  - correct layer placement

Priority: Medium

## Suggested Implementation Order

1. Fix type ownership leaks
2. Remove app constant coupling
3. Align docs and Storybook
4. Tighten the compatibility barrel
5. Reclassify system and pattern exports
6. Clean internal residue
7. Add CI and lint guardrails
