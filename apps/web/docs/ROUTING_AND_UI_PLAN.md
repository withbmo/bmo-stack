# Routing & UI Consistency Plan

This document defines how `app/` pages and feature folders should be structured so the codebase stays consistent.

---

## Core Principle

**App pages are thin routing wrappers.** They map URLs to route components. All UI and business logic live in feature folders or domain folders.

```
app/(site)/hub/page.tsx          →  imports HubRoute from shared/routes/hub
app/(dashboard)/dashboard/hub/   →  imports HubRoute from shared/routes/hub
```

---

## Folder Roles

| Folder                 | Purpose                            | Contains                                                        |
| ---------------------- | ---------------------------------- | --------------------------------------------------------------- |
| `app/`                 | **Routing only**                   | `page.tsx`, `layout.tsx`, `error.tsx` – URL → component mapping |
| `common/features/*`    | Shared features (site + dashboard) | Routes, hooks, components, data                                 |
| `dashboard/features/*` | Dashboard-only features            | Routes, hooks, components, data                                 |
| `site/`                | Site-only (landing, marketing)     | Sections, components, data                                      |

---

## App Page Rules

### 1. App pages must be thin

```tsx
// ✅ Good – thin wrapper
'use client';
import { DeploymentsRoute } from '@/dashboard/features/deployments';

export default function DeploymentsPage() {
  return <DeploymentsRoute />;
}
```

```tsx
// ❌ Bad – UI in app
export default function DeploymentsPage() {
  const [filter, setFilter] = useState('all');
  return (
    <div className="...">
      <DeployJobTable ... />
    </div>
  );
}
```

### 2. Where route components live

| Route type                | Feature folder                      | Example                                                                     |
| ------------------------- | ----------------------------------- | --------------------------------------------------------------------------- |
| Shared (site + dashboard) | `common/features/<name>/routes/`    | HubRoute, ContributeRoute                                                   |
| Dashboard-only            | `dashboard/features/<name>/routes/` | DeploymentsRoute, NewEnvironmentRoute                                       |
| Site-only (marketing)     | `site/sections/`                    | HeroSection, PricingSection                                                 |
| Auth                      | `common/features/auth/routes/`      | LoginRoute, SignupRoute, CallbackRoute |

### 3. Naming convention

- **Route components**: `*Route` (e.g. `HubRoute`, `DeploymentsRoute`, `SignupRoute`)
- **Page components**: default export in `page.tsx`, named `*Page` if needed

---

## Migration Checklist (Current Inconsistencies)

All migrations complete. Pages now following the plan:

- `app/(site)/auth/login/page.tsx` → `LoginRoute`
- `app/(site)/auth/signup/page.tsx` → `SignupRoute`
- `app/(site)/auth/callback/page.tsx` → `CallbackRoute`
- `app/(site)/pricing/page.tsx` → `PricingRoute`
- `app/(site)/docs/page.tsx`, `app/(site)/docs/[slug]/page.tsx` → `DocsRoute`

Pages already following the plan:

- `app/(site)/hub/page.tsx` → `HubRoute`
- `app/(site)/page.tsx` → `HeroSection`, `WorkflowSection`, etc.
- All `app/(dashboard)/dashboard/*` pages → thin wrappers

---

## Implementation Order

1. **Auth routes** – Extract LoginRoute, SignupRoute, CallbackRoute into `common/features/auth/routes/`. Auth pages become thin wrappers. (Done)
2. **Pricing** – Extract PricingRoute to `common/features/pricing/routes/`. (Done)
3. **Docs** – Extract DocsRoute to `common/features/docs/routes/`. (Done)

---

## Exceptions

- **Callback / redirect-only pages**: Can stay in app if they only handle redirects and have no UI.
- **Layout files**: Stay in app; they define structure, not feature logic.
- **Error / not-found**: Stay in app; they are framework-level.

---

## Summary

| Question                                 | Answer                                                                         |
| ---------------------------------------- | ------------------------------------------------------------------------------ |
| Where does UI go?                        | Feature folders (`common/features/*`, `dashboard/features/*`, `site/sections`) |
| What goes in app?                        | Thin `page.tsx` that imports and renders a route component                     |
| When to use common vs dashboard vs site? | Common = shared; Dashboard = app-only; Site = landing/marketing                |
