import { User } from 'lucide-react';

// Tab definitions
export const SETTINGS_TABS = [
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'billing', icon: User, label: 'Billing' },
] as const;

export type SettingsTabId = (typeof SETTINGS_TABS)[number]["id"];

// Usage metrics mock data
export const USAGE_METRICS = [
  { id: "compute", label: "Compute Hours", value: "72 / 100", percent: 72 },
  { id: "storage", label: "Storage", value: "48 GB / 75 GB", percent: 64 },
  { id: "bandwidth", label: "Bandwidth", value: "1.1 TB / 2 TB", percent: 55 },
] as const;
