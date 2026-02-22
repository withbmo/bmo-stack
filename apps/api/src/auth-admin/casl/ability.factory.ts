import type { AdminLevel } from '@pytholit/contracts';
import type { Permissions } from 'nest-casl';

import {
  AdminMembershipSubject,
  BillingSubject,
  DeployJobSubject,
  EnvironmentSubject,
  UserSubject,
} from './subjects';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';

export type Roles = AdminLevel;

export type AppAuthorizableUser = {
  id: string;
  roles: Roles[];
  isAdmin?: boolean;
  adminLevel?: AdminLevel | null;
};

export const appPermissions: Permissions<
  Roles,
  | typeof UserSubject
  | typeof EnvironmentSubject
  | typeof DeployJobSubject
  | typeof BillingSubject
  | typeof AdminMembershipSubject
  | 'all',
  Actions,
  AppAuthorizableUser
> = {
  owner({ can }) {
    can('manage', 'all');
  },

  operator({ can }) {
    can('read', UserSubject);
    can('update', UserSubject);
    can('read', EnvironmentSubject);
    can('read', DeployJobSubject);
    can('update', DeployJobSubject);
    can('read', BillingSubject);
  },

  viewer({ can }) {
    can('read', UserSubject);
    can('read', EnvironmentSubject);
    can('read', DeployJobSubject);
    can('read', BillingSubject);
  },
};
