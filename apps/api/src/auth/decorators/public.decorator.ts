import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

/**
 * Marks a route or controller as publicly accessible without authentication.
 *
 * This is a semantic alias for Better Auth's `@AllowAnonymous()` decorator.
 * Use this decorator to indicate that an endpoint does not require authentication.
 *
 * **Usage on Controller:**
 * ```typescript
 * @Controller('auth')
 * @Public() // All routes in this controller are public
 * export class AuthController {
 *   // ... public endpoints
 * }
 * ```
 *
 * **Usage on Specific Route:**
 * ```typescript
 * @Controller('billing')
 * export class BillingController {
 *   @Public() // Only this route is public
 *   @Post('webhook')
 *   async handleWebhook(@Body() body: WebhookDto) {
 *     // ... handle webhook
 *   }
 * }
 * ```
 *
 * **Common Use Cases:**
 * - Authentication endpoints (login, signup, password reset)
 * - Webhook endpoints (billing providers, external services)
 * - Health check endpoints
 * - Public API endpoints
 *
 * @decorator MethodDecorator | ClassDecorator
 *
 * @see {@link BetterAuthGuard}
 * @see {@link AllowAnonymous}
 */
export const Public = AllowAnonymous;
