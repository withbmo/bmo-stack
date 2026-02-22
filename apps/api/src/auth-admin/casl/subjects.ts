/**
 * CASL Subject definitions for authorization.
 *
 * These empty classes serve as type markers for CASL's ability definitions.
 * Each subject represents a resource type that can be protected by authorization rules.
 *
 * **Usage in Permissions:**
 * ```typescript
 * admin({ can }) {
 *   can('manage', UserSubject);    // Admin can manage users
 *   can('read', BillingSubject);   // Admin can read billing data
 * }
 * ```
 *
 * **Usage in Controllers:**
 * ```typescript
 * @Controller('users')
 * @UseAbility('read', UserSubject)
 * export class UsersController { }
 * ```
 *
 * @module CaslSubjects
 * @see {@link appPermissions}
 * @see {@link https://casl.js.org/v6/en/guide/subject-type-detection CASL Subject Types}
 */

/**
 * Subject representing user accounts and profiles.
 *
 * Actions: read, update, delete, manage
 *
 * @class UserSubject
 */
export class UserSubject {}

/**
 * Subject representing deployment environments.
 *
 * Actions: create, read, update, delete, manage
 *
 * @class EnvironmentSubject
 */
export class EnvironmentSubject {}

/**
 * Subject representing deployment jobs.
 *
 * Actions: read, update, delete, manage
 *
 * @class DeployJobSubject
 */
export class DeployJobSubject {}

/**
 * Subject representing billing and payment data.
 *
 * Actions: read, update, manage
 *
 * @class BillingSubject
 */
export class BillingSubject {}

/**
 * Subject representing projects.
 *
 * Actions: create, read, update, delete, manage
 *
 * @class ProjectSubject
 */
export class ProjectSubject {}

/**
 * Subject representing admin membership records.
 *
 * Actions: read, create, update, delete, manage
 *
 * @class AdminMembershipSubject
 */
export class AdminMembershipSubject {}
