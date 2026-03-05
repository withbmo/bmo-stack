import { CreditCard, Gauge, User } from 'lucide-react';

// Tab definitions
export const SETTINGS_TABS = [
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'billing', icon: CreditCard, label: 'Billing' },
  { id: 'usage', icon: Gauge, label: 'Usage' },
] as const;

export type SettingsTabId = (typeof SETTINGS_TABS)[number]["id"];

// Usage metrics mock data
export const USAGE_METRICS = [
  { id: "compute", label: "Compute Hours", value: "72 / 100", percent: 72 },
  { id: "storage", label: "Storage", value: "48 GB / 75 GB", percent: 64 },
  { id: "bandwidth", label: "Bandwidth", value: "1.1 TB / 2 TB", percent: 55 },
] as const;

// Billing history mock data
export const BILLING_HISTORY = [
  {
    invoice: "INV-2026-001",
    period: "January 2026",
    amount: "$49.00",
    status: "Paid" as const,
    date: "2026-02-01",
  },
  {
    invoice: "INV-2025-012",
    period: "December 2025",
    amount: "$49.00",
    status: "Paid" as const,
    date: "2026-01-01",
  },
  {
    invoice: "INV-2025-011",
    period: "November 2025",
    amount: "$49.00",
    status: "Failed" as const,
    date: "2025-12-01",
  },
] as const;

// Plan features
export const PLAN_FEATURES = [
  "Up to 10 active projects",
  "100 compute hours / month",
  "Team collaboration & RBAC",
  "Priority support (4h SLA)",
] as const;
