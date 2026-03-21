import { User } from 'lucide-react';

// Tab definitions
export const SETTINGS_TABS = [
  { id: 'profile', icon: User, label: 'Profile' },
] as const;

export type SettingsTabId = (typeof SETTINGS_TABS)[number]["id"];
