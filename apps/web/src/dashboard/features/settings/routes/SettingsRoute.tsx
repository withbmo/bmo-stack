'use client';

import { ProfileSettingsRoute } from '../profile/routes/ProfileSettingsRoute';

/**
 * Default settings route.
 * Keeps /dashboard/settings aligned with the profile section.
 */
export const SettingsRoute = () => {
  return <ProfileSettingsRoute />;
};
