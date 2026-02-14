import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { StripeService } from './stripe.service';
import type Stripe from 'stripe';
import {
  getPlans,
  getPlanById,
  getStripePriceId,
  getDefaultPlan,
  getPlanCredits,
  PLANS,
} from '@pytholit/config';
import type { BillingInterval, Plan as ApiPlan, PublicPlan } from '@pytholit/contracts';

type ConfigPlan = ReturnType<typeof getDefaultPlan>;
import { Logger } from '@nestjs/common';
import { Prisma } from '@pytholit/db';
import { EntitlementsService } from '../entitlements/entitlements.service';

/**
 * Billing Service
 * Handles subscription management and payment processing
 */
@Injectable()
export class BillingService {
  private readonly frontendUrl: string;
  private readonly logger = new Logger(BillingService.name);
  private priceIdToPlanIdCache: Map<string, string> | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
    private readonly entitlementsService: EntitlementsService
  ) {
    this.frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ||
      'http://localhost:3000';
  }

  private toApiPlan(plan: ConfigPlan | null): ApiPlan | null {
    if (!plan) return null;
    return {
      id: plan.id,
      name: plan.name,
      displayName: plan.displayName,
      description: plan.description ?? null,
      monthlyPrice: plan.monthlyPrice,
      yearlyPrice: plan.yearlyPrice,
      monthlyCredits: getPlanCredits(plan.id, 'month'),
      yearlyCredits: getPlanCredits(plan.id, 'year'),
      stripePriceIdMonthly: plan.stripePriceIdMonthly ?? null,
      stripePriceIdYearly: plan.stripePriceIdYearly ?? null,
      features: plan.features ?? [],
      isActive: Boolean(plan.isActive),
    };
  }

  private toPublicPlan(plan: ConfigPlan | null): PublicPlan | null {
    const apiPlan = this.toApiPlan(plan);
    if (!apiPlan) return null;
    const { stripePriceIdMonthly, stripePriceIdYearly, ...rest } = apiPlan;
    return rest;
  }

  private getPriceIdToPlanIdMap(): Map<string, string> {
    if (this.priceIdToPlanIdCache) return this.priceIdToPlanIdCache;
    const map = new Map<string, string>();

    for (const plan of PLANS as any[]) {
      const monthly = plan?.stripePriceIdMonthly ?? null;
      const yearly = plan?.stripePriceIdYearly ?? null;
      if (typeof monthly === 'string' && monthly.length > 0) {
        map.set(monthly, plan.id);
      }
      if (typeof yearly === 'string' && yearly.length > 0) {
        map.set(yearly, plan.id);
      }
    }

    this.priceIdToPlanIdCache = map;
    return map;
  }

  private resolvePlanIdFromStripeSubscription(
    subscription: Stripe.Subscription
  ): string | null {
    const metaPlanId = subscription.metadata?.planId;
    if (metaPlanId && typeof metaPlanId === 'string') {
      return metaPlanId;
    }

    const priceId = subscription.items?.data?.[0]?.price?.id ?? null;
    if (!priceId) return null;

    return this.getPriceIdToPlanIdMap().get(priceId) ?? null;
  }

  private normalizeSubscriptionStatus(
    status: Stripe.Subscription.Status
  ): 'active' | 'trialing' | 'past_due' | 'unpaid' | 'canceled' {
    switch (status) {
      case 'active':
      case 'trialing':
      case 'past_due':
      case 'unpaid':
      case 'canceled':
        return status;
      default:
        return 'unpaid';
    }
  }

  private normalizeInvoiceStatus(
    status: Stripe.Invoice.Status | null
  ): 'draft' | 'open' | 'paid' | 'void' | 'uncollectible' {
    switch (status) {
      case 'draft':
      case 'open':
      case 'paid':
      case 'void':
      case 'uncollectible':
        return status;
      default:
        return 'open';
    }
  }

  /**
   * Create Stripe customer for user
   */
  async createStripeCustomer(userId: string): Promise<string> {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.stripeCustomerId) {
      return user.stripeCustomerId;
    }

    const customer = await this.stripeService.createCustomer({
      email: user.email,
      name: user.fullName || undefined,
      metadata: {
        userId: user.id,
      },
    });

    await this.prisma.client.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    });

    return customer.id;
  }

  /**
   * Create checkout session for subscription
   */
  async createCheckoutSession(
    userId: string,
    planId: string,
    interval: BillingInterval = 'month'
  ): Promise<{ sessionId: string; url: string }> {
    const plan = getPlanById(planId);
    const priceId = getStripePriceId(planId, interval);

    if (!plan || !priceId || !plan.isActive) {
      throw new BadRequestException('Invalid plan or plan not configured for billing');
    }

    // Ensure user has Stripe customer
    const customerId = await this.createStripeCustomer(userId);

    const session = await this.stripeService.createCheckoutSession({
      customerId,
      priceId,
      successUrl: `${this.frontendUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${this.frontendUrl}/billing/canceled`,
      metadata: {
        userId,
        planId,
      },
      subscriptionMetadata: {
        planId,
        interval,
      },
    });

    return {
      sessionId: session.id,
      url: session.url!,
    };
  }

  /**
   * Create billing portal session
   */
  async createPortalSession(userId: string): Promise<{ url: string }> {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
    });

    if (!user?.stripeCustomerId) {
      throw new BadRequestException('No billing account found');
    }

    const session = await this.stripeService.createPortalSession({
      customerId: user.stripeCustomerId,
      returnUrl: `${this.frontendUrl}/settings/billing`,
    });

    return { url: session.url };
  }

  /**
   * Get user's subscription details
   */
  async getSubscription(userId: string) {
    const subscription = await this.prisma.client.subscription.findFirst({
      where: {
        userId,
        status: {
          in: ['active', 'trialing', 'past_due'],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!subscription) {
      return null;
    }

    const resolvedPlan = subscription.planId
      ? getPlanById(subscription.planId)
      : getDefaultPlan();

    if (!resolvedPlan) {
      this.logger.warn(
        `Subscription ${subscription.id} has unknown planId: ${subscription.planId}`
      );
    }

    return {
      ...subscription,
      plan: this.toApiPlan(resolvedPlan ?? getDefaultPlan()),
    };
  }

  /**
   * Get user's invoices with pagination
   */
  async getUserInvoices(userId: string, limit = 10, offset = 0) {
    return this.prisma.client.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Get all active subscription plans
   */
  async getActivePlans() {
    return getPlans()
      .sort((a, b) => a.monthlyPrice - b.monthlyPrice)
      .map((plan) => this.toPublicPlan(plan))
      .filter((plan): plan is NonNullable<typeof plan> => plan !== null);
  }

  /**
   * Get user's payment methods
   */
  async getUserPaymentMethods(userId: string) {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      return [];
    }

    const stripe = this.stripeService.getClient();

    const [customer, methods] = await Promise.all([
      stripe.customers.retrieve(user.stripeCustomerId),
      stripe.paymentMethods.list({
        customer: user.stripeCustomerId,
        type: 'card',
      }),
    ]);

    // Stripe may return a deleted customer object
    const defaultPaymentMethod =
      (customer as any)?.deleted === true
        ? null
        : (customer as Stripe.Customer)?.invoice_settings?.default_payment_method ??
          null;

    const defaultPaymentMethodId =
      typeof defaultPaymentMethod === 'string'
        ? defaultPaymentMethod
        : defaultPaymentMethod?.id ?? null;

    return methods.data.map((pm) => {
      const card = pm.card;
      return {
        id: pm.id,
        stripePaymentMethodId: pm.id,
        type: pm.type,
        last4: card?.last4 ?? '',
        brand: card?.brand ?? null,
        expiryMonth: card?.exp_month ?? null,
        expiryYear: card?.exp_year ?? null,
        isDefault: defaultPaymentMethodId ? pm.id === defaultPaymentMethodId : false,
      };
    });
  }

  /**
   * Validate payment method
   */
  async validatePaymentMethod(
    userId: string,
    paymentMethodId: string
  ): Promise<{ valid: boolean; error?: string }> {
    try {
      const user = await this.prisma.client.user.findUnique({
        where: { id: userId },
        select: { stripeCustomerId: true },
      });

      if (!user?.stripeCustomerId) {
        return { valid: false, error: 'No billing account found' };
      }

      // Retrieve payment method from Stripe to validate it exists and is valid
      const paymentMethod = await this.stripeService.getClient().paymentMethods.retrieve(
        paymentMethodId
      );

      if (!paymentMethod) {
        return { valid: false, error: 'Payment method not found' };
      }

      const pmCustomer =
        typeof paymentMethod.customer === 'string'
          ? paymentMethod.customer
          : paymentMethod.customer?.id ?? null;

      if (!pmCustomer || pmCustomer !== user.stripeCustomerId) {
        return { valid: false, error: 'Payment method does not belong to customer' };
      }

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Record usage for metered billing
   */
  async recordUsage(
    userId: string,
    data: { metricName: string; value: number }
  ): Promise<{ recorded: boolean }> {
    const result = await this.entitlementsService.recordUsage(
      userId,
      data.metricName,
      data.value
    );
    return { recorded: Boolean((result as any)?.recorded) };
  }

  /**
   * Handle Stripe webhook events
   */
  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    const isNewEvent = await this.markStripeEventAsProcessed(event);
    if (!isNewEvent) {
      this.logger.log(`Duplicate webhook event skipped: ${event.id} (${event.type})`);
      return;
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        this.logger.log(`Unhandled webhook event: ${event.type}`);
    }
  }

  private async markStripeEventAsProcessed(event: Stripe.Event): Promise<boolean> {
    if (!event?.id) return true;

    try {
      await this.prisma.client.stripeWebhookEvent.create({
        data: {
          id: event.id,
          type: event.type,
        },
      });
      return true;
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        return false;
      }
      throw err;
    }
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;
    const subscriptionId = session.subscription as string | undefined;

    if (!userId || !planId) {
      this.logger.error('Missing metadata in checkout session');
      return;
    }

    if (!subscriptionId) {
      return;
    }

    if (typeof session.customer === 'string') {
      await this.prisma.client.user.updateMany({
        where: { id: userId, stripeCustomerId: null },
        data: { stripeCustomerId: session.customer },
      });
    }

    let stripeSubscription: Stripe.Subscription | null = null;
    try {
      stripeSubscription = await this.stripeService.getSubscription(subscriptionId);
    } catch {
      stripeSubscription = null;
    }

    if (stripeSubscription) {
      await this.handleSubscriptionUpdate(stripeSubscription);
      return;
    }

    await this.prisma.client.subscription.upsert({
      where: { stripeSubscriptionId: subscriptionId },
      create: {
        userId,
        stripeSubscriptionId: subscriptionId,
        status: 'active',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(),
        cancelAtPeriodEnd: false,
        planId,
      },
      update: {
        planId,
      },
    });
  }

  private async handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;

    const user = await this.prisma.client.user.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      this.logger.error(`User not found for customer: ${customerId}`);
      return;
    }

    // Upsert subscription
    const planId = this.resolvePlanIdFromStripeSubscription(subscription);

    await this.prisma.client.subscription.upsert({
      where: { stripeSubscriptionId: subscription.id },
      create: {
        userId: user.id,
        stripeSubscriptionId: subscription.id,
        status: this.normalizeSubscriptionStatus(subscription.status),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        planId,
      },
      update: {
        status: this.normalizeSubscriptionStatus(subscription.status),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        planId,
      },
    });
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;

    const user = await this.prisma.client.user.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (!user) return;

    // Update subscription status
    await this.prisma.client.subscription.updateMany({
      where: { stripeSubscriptionId: subscription.id },
      data: { status: 'canceled' },
    });
  }

  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string;

    const user = await this.prisma.client.user.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (!user) return;

    // Stripe provides amounts in minor units (e.g. cents)
    const amountPaidCents = invoice.amount_paid ?? 0;

    await this.prisma.client.invoice.upsert({
      where: { stripeInvoiceId: invoice.id },
      create: {
        userId: user.id,
        stripeInvoiceId: invoice.id,
        amount: amountPaidCents,
        currency: invoice.currency,
        status: this.normalizeInvoiceStatus(invoice.status),
        paidAt: invoice.status_transitions?.paid_at
          ? new Date(invoice.status_transitions.paid_at * 1000)
          : null,
        dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
        invoiceUrl: invoice.hosted_invoice_url,
        pdfUrl: invoice.invoice_pdf,
      },
      update: {
        amount: amountPaidCents,
        currency: invoice.currency,
        status: this.normalizeInvoiceStatus(invoice.status),
        paidAt: invoice.status_transitions?.paid_at
          ? new Date(invoice.status_transitions.paid_at * 1000)
          : null,
        dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
        invoiceUrl: invoice.hosted_invoice_url,
        pdfUrl: invoice.invoice_pdf,
      },
    });
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    // TODO: Send notification to user about failed payment
    this.logger.warn(`Payment failed for invoice: ${invoice.id}`);
  }
}
