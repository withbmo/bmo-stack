import type { ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { AccessGuard, AccessService } from 'nest-casl';

/**
 * Metadata key used by CASL to store ability requirements on routes.
 *
 * @constant {string}
 * @internal
 */
const CASL_ABILITY_METADATA_KEY = 'CASL_META_ABILITY';

/**
 * Authorization guard using CASL (Contextual Authorization Specification Language).
 *
 * This guard extends nest-casl's AccessGuard to provide authorization
 * for controllers and routes using admin membership levels.
 *
 * **Features:**
 * - Integrates with CASL for flexible authorization rules
 * - Respects `@UseAbility()` decorator on routes
 * - Allows access if no ability decorator is present (opt-in authorization)
 * - Works in conjunction with {@link BetterAuthGuard} for complete auth
 *
 * **Guard Chain Order (in AppModule):**
 * 1. BetterAuthGuard - Authentication
 * 2. CaslAuthorizationGuard - Authorization (this guard)
 * 3. ThrottlerGuard - Rate limiting
 *
 * **Usage with Decorator:**
 * ```typescript
 * @Controller('admin/users')
 * @UseAbility('read', UserSubject) // Requires 'read' permission on UserSubject
 * export class AdminUsersController {
 *   @Patch(':id')
 *   @UseAbility('update', UserSubject) // Override with 'update' permission
 *   async update(@Param('id') id: string) { }
 * }
 * ```
 *
 * @class CaslAuthorizationGuard
 * @extends {AccessGuard}
 * @Injectable
 *
 * @see {@link AccessGuard}
 * @see {@link BetterAuthGuard}
 * @see {@link appPermissions}
 * @see {@link https://casl.js.org/ CASL Documentation}
 * @see {@link https://www.npmjs.com/package/nest-casl nest-casl}
 */
@Injectable()
export class CaslAuthorizationGuard extends AccessGuard {
  /**
   * Creates an instance of CaslAuthorizationGuard.
   *
   * @param {Reflector} appReflector - NestJS reflector for metadata access
   * @param {AccessService} accessService - CASL access service
   * @param {ModuleRef} moduleRef - NestJS module reference
   */
  constructor(
    private readonly appReflector: Reflector,
    accessService: AccessService,
    moduleRef: ModuleRef
  ) {
    super(appReflector, accessService, moduleRef);
  }

  /**
   * Determines if the user is authorized to access the route.
   *
   * Execution flow:
   * 1. Checks if route has `@UseAbility()` decorator
   * 2. If no decorator present, allows access (opt-in authorization)
   * 3. If decorator present, delegates to CASL AccessGuard
   *
   * @param {ExecutionContext} context - NestJS execution context
   * @returns {Promise<boolean>} True if authorized or no ability required
   *
   * @async
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route has @UseAbility() decorator
    const ability = this.appReflector.getAllAndOverride(CASL_ABILITY_METADATA_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no ability decorator, allow access (opt-in authorization)
    if (!ability) return true;

    // Delegate to CASL AccessGuard for permission checking
    return super.canActivate(context);
  }
}
