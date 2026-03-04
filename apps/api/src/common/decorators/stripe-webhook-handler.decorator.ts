import { SetMetadata } from '@nestjs/common';

export const STRIPE_WEBHOOK_HANDLER = 'STRIPE_WEBHOOK_HANDLER';

export interface StripeWebhookHandlerMetadata {
  eventNames: string[];
}

/**
 * Decorator for methods that should handle specific Stripe webhook events.
 *
 * @param eventNames - The Stripe event name(s) to handle (e.g., 'customer.subscription.updated' or ['invoice.paid', 'invoice.payment_failed'])
 * @returns A method decorator
 *
 * @example
 * @StripeWebhookHandler('customer.subscription.updated')
 * async handleSubscriptionUpdate(event: Stripe.Event): Promise<void> {
 *   const subscription = event.data.object as Stripe.Subscription;
 *   // Process subscription update
 * }
 *
 * @example
 * @StripeWebhookHandler(['checkout.session.completed', 'checkout.session.async_payment_succeeded'])
 * async handleCheckoutSession(event: Stripe.Event): Promise<void> {
 *   // Process checkout session
 * }
 */
export const StripeWebhookHandler = (eventNames: string | string[]) =>
  SetMetadata<string, StripeWebhookHandlerMetadata>(STRIPE_WEBHOOK_HANDLER, {
    eventNames: Array.isArray(eventNames) ? eventNames : [eventNames],
  });
