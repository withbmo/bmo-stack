import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { createHmac, timingSafeEqual } from 'crypto';

import { PrismaService } from '../database/prisma.service';
import { BillingConfigService } from './billing.config';
import type {
  CreateBillableMetricInput,
  CreatePlanInput,
  LagoBillableMetric,
  LagoCheckoutUrlResponse,
  LagoCustomer,
  LagoEvent,
  LagoInvoice,
  LagoInvoicePaymentUrlResponse,
  LagoPlan,
  LagoPortalUrlResponse,
  LagoSubscription,
  LagoWallet,
  LagoWalletTransaction,
  LagoWebhookEvent,
} from './lago.types';

@Injectable()
export class LagoService {
  private readonly logger = new Logger(LagoService.name);
  private readonly client: AxiosInstance;

  constructor(
    private readonly billingConfig: BillingConfigService,
    private readonly prisma: PrismaService
  ) {
    this.client = axios.create({
      baseURL: this.billingConfig.lagoApiUrl,
      timeout: 8000,
      headers: {
        Authorization: this.billingConfig.lagoApiKey ? `Bearer ${this.billingConfig.lagoApiKey}` : '',
        'Content-Type': 'application/json',
      },
    });
  }

  async createCustomer(userId: string): Promise<LagoCustomer> {
    this.ensureEnabled();

    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const existing = await this.getCustomer(userId);
    if (existing) {
      return existing;
    }

    const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || undefined;
    const response = await this.request<{ customer: LagoCustomer }>({
      method: 'post',
      url: '/customers',
      data: {
        customer: {
          external_customer_id: user.id,
          name,
          email: user.email,
        },
      },
    });

    return response.customer;
  }

  async getCustomer(userId: string): Promise<LagoCustomer | null> {
    this.ensureEnabled();

    try {
      const byId = await this.request<{ customer: LagoCustomer }>({
        method: 'get',
        url: `/customers/${encodeURIComponent(userId)}`,
      });
      return byId.customer;
    } catch {
      try {
        const response = await this.request<{ customers: LagoCustomer[] }>({
          method: 'get',
          url: '/customers',
          params: { external_customer_id: userId },
        });
        return response.customers?.[0] ?? null;
      } catch {
        return null;
      }
    }
  }

  async regenerateCustomerCheckoutUrl(userId: string, pendingPlanCode?: string): Promise<string> {
    this.ensureEnabled();
    await this.createCustomer(userId);

    const successUrlBase = `${this.billingConfig.frontendUrl}/dashboard/settings/billing?setup=success`;
    const successUrl =
      pendingPlanCode != null
        ? `${successUrlBase}&pendingPlanCode=${encodeURIComponent(pendingPlanCode)}`
        : successUrlBase;
    const cancelUrl = `${this.billingConfig.frontendUrl}/dashboard/settings/billing?setup=canceled`;

    const payload = await this.request<LagoCheckoutUrlResponse>({
      method: 'post',
      url: `/customers/${encodeURIComponent(userId)}/checkout_url`,
      data: {
        checkout_url: {
          success_url: successUrl,
          cancel_url: cancelUrl,
        },
      },
    });

    const checkoutUrl = payload.checkout_url ?? payload.customer?.checkout_url ?? null;
    if (!checkoutUrl) {
      throw new ServiceUnavailableException('Lago checkout URL is unavailable');
    }
    return checkoutUrl;
  }

  async getCustomerPortalUrl(userId: string): Promise<string> {
    this.ensureEnabled();
    await this.createCustomer(userId);

    const payload = await this.request<LagoPortalUrlResponse>({
      method: 'get',
      url: `/customers/${encodeURIComponent(userId)}/portal_url`,
    });

    const portalUrl = payload.portal_url ?? payload.customer?.portal_url ?? null;
    if (!portalUrl) {
      throw new ServiceUnavailableException('Lago portal URL is unavailable');
    }
    return portalUrl;
  }

  async hasCustomerPaymentProvider(userId: string): Promise<boolean> {
    this.ensureEnabled();
    const customer = await this.getCustomer(userId);
    if (!customer) return false;

    const dynamic = customer as unknown as Record<string, unknown>;
    return Boolean(
      customer.payment_provider ||
        customer.payment_provider_code ||
        customer.provider_customer_id ||
        customer.payment_method_id ||
        dynamic.payment_provider_id ||
        dynamic.payment_provider_customer ||
        dynamic.provider_payment_method ||
        dynamic.stripe_customer_id ||
        (dynamic.payment_provider != null && typeof dynamic.payment_provider === 'object')
    );
  }

  async createSubscription(userId: string, planCode: string): Promise<LagoSubscription> {
    this.ensureEnabled();

    await this.createCustomer(userId);
    const response = await this.request<{ subscription: LagoSubscription }>({
      method: 'post',
      url: '/subscriptions',
      data: {
        subscription: {
          external_customer_id: userId,
          plan_code: planCode,
        },
      },
    });
    return response.subscription;
  }

  async getSubscription(userId: string): Promise<LagoSubscription | null> {
    this.ensureEnabled();

    try {
      const response = await this.request<{ subscriptions: LagoSubscription[] }>({
        method: 'get',
        url: '/subscriptions',
        params: { external_customer_id: userId },
      });
      return response.subscriptions?.[0] ?? null;
    } catch {
      return null;
    }
  }

  async terminateSubscription(subscriptionId: string): Promise<void> {
    this.ensureEnabled();

    try {
      await this.request({
        method: 'post',
        url: `/subscriptions/${encodeURIComponent(subscriptionId)}/terminate`,
      });
    } catch {
      await this.request({
        method: 'delete',
        url: `/subscriptions/${encodeURIComponent(subscriptionId)}`,
      });
    }
  }

  async getInvoices(userId: string): Promise<LagoInvoice[]> {
    this.ensureEnabled();
    const response = await this.request<{ invoices: LagoInvoice[] }>({
      method: 'get',
      url: '/invoices',
      params: { external_customer_id: userId },
    });
    return response.invoices ?? [];
  }

  async createOneOffInvoiceForCredits(
    userId: string,
    amountUsd: number,
    credits: number
  ): Promise<LagoInvoice> {
    this.ensureEnabled();
    await this.createCustomer(userId);

    const response = await this.request<{ invoice: LagoInvoice }>({
      method: 'post',
      url: '/invoices',
      data: {
        invoice: {
          external_customer_id: userId,
          currency: 'USD',
          fees: [
            {
              amount_cents: amountUsd * 100,
              amount_currency: 'USD',
              description: `Credits top-up (${credits})`,
            },
          ],
        },
      },
    });

    return response.invoice;
  }

  async generateInvoicePaymentUrl(invoiceId: string): Promise<string> {
    this.ensureEnabled();

    const response = await this.request<LagoInvoicePaymentUrlResponse>({
      method: 'post',
      url: `/invoices/${encodeURIComponent(invoiceId)}/payment_url`,
    });

    const paymentUrl = response.payment_url ?? response.invoice?.payment_url ?? null;
    if (!paymentUrl) {
      throw new ServiceUnavailableException('Lago invoice payment URL is unavailable');
    }
    return paymentUrl;
  }

  async getCurrentUsage(userId: string, metricCode: string): Promise<number> {
    this.ensureEnabled();

    try {
      const byCustomer = await this.request<Record<string, unknown>>({
        method: 'get',
        url: `/customers/${encodeURIComponent(userId)}/current_usage`,
      });
      return this.extractUsageValue(byCustomer, metricCode);
    } catch {
      try {
        const byQuery = await this.request<Record<string, unknown>>({
          method: 'get',
          url: '/current_usage',
          params: { external_customer_id: userId },
        });
        return this.extractUsageValue(byQuery, metricCode);
      } catch {
        return 0;
      }
    }
  }

  async sendEvent(event: LagoEvent): Promise<void> {
    this.ensureEnabled();
    await this.request({
      method: 'post',
      url: '/events',
      data: { event },
    });
  }

  async batchSendEvents(events: LagoEvent[]): Promise<void> {
    this.ensureEnabled();
    if (events.length === 0) {
      return;
    }

    await this.request({
      method: 'post',
      url: '/events/batch',
      data: { events },
    });
  }

  async createWallet(userId: string, credits: number): Promise<LagoWallet> {
    this.ensureEnabled();
    await this.createCustomer(userId);

    const response = await this.request<{ wallet: LagoWallet }>({
      method: 'post',
      url: '/wallets',
      data: {
        wallet: {
          external_customer_id: userId,
          name: 'Prepaid Credits',
          rate_amount: '0.10',
          currency: 'USD',
          paid_credits: credits.toString(),
          granted_credits: '0.0',
        },
      },
    });

    return response.wallet;
  }

  async getWallet(userId: string): Promise<LagoWallet | null> {
    this.ensureEnabled();

    try {
      const response = await this.request<{ wallets: LagoWallet[] }>({
        method: 'get',
        url: '/wallets',
        params: { external_customer_id: userId },
      });
      return response.wallets?.[0] ?? null;
    } catch {
      return null;
    }
  }

  async topUpWallet(walletId: string, credits: number): Promise<LagoWalletTransaction> {
    this.ensureEnabled();

    const response = await this.request<{ wallet_transaction: LagoWalletTransaction }>({
      method: 'post',
      url: '/wallet_transactions',
      data: {
        wallet_transaction: {
          wallet_id: walletId,
          paid_credits: credits.toString(),
          granted_credits: '0.0',
        },
      },
    });

    return response.wallet_transaction;
  }

  async getWalletBalance(userId: string): Promise<number> {
    this.ensureEnabled();
    const wallet = await this.getWallet(userId);
    return wallet ? parseFloat(wallet.balance) : 0;
  }

  async createBillableMetric(input: CreateBillableMetricInput): Promise<LagoBillableMetric> {
    this.ensureEnabled();

    const response = await this.request<{ billable_metric: LagoBillableMetric }>({
      method: 'post',
      url: '/billable_metrics',
      data: {
        billable_metric: {
          code: input.code,
          name: input.name,
          description: input.description,
          aggregation_type: input.aggregation_type,
          recurring: input.recurring ?? false,
          field_name: input.field_name,
        },
      },
    });

    return response.billable_metric;
  }

  async getBillableMetric(code: string): Promise<LagoBillableMetric | null> {
    this.ensureEnabled();

    try {
      const response = await this.request<{ billable_metric: LagoBillableMetric }>({
        method: 'get',
        url: `/billable_metrics/${encodeURIComponent(code)}`,
      });
      return response.billable_metric;
    } catch {
      return null;
    }
  }

  async listBillableMetrics(): Promise<LagoBillableMetric[]> {
    this.ensureEnabled();

    const response = await this.request<{ billable_metrics: LagoBillableMetric[] }>({
      method: 'get',
      url: '/billable_metrics',
    });

    return response.billable_metrics ?? [];
  }

  async createPlan(input: CreatePlanInput): Promise<LagoPlan> {
    this.ensureEnabled();

    const response = await this.request<{ plan: LagoPlan }>({
      method: 'post',
      url: '/plans',
      data: {
        plan: {
          code: input.code,
          name: input.name,
          description: input.description,
          interval: input.interval,
          amount_cents: input.amount_cents,
          amount_currency: input.amount_currency,
          pay_in_advance: input.pay_in_advance ?? false,
          charges: input.charges,
        },
      },
    });

    return response.plan;
  }

  async getPlan(code: string): Promise<LagoPlan | null> {
    this.ensureEnabled();

    try {
      const response = await this.request<{ plan: LagoPlan }>({
        method: 'get',
        url: `/plans/${encodeURIComponent(code)}`,
      });
      return response.plan;
    } catch {
      return null;
    }
  }

  async listPlans(): Promise<LagoPlan[]> {
    this.ensureEnabled();

    const response = await this.request<{ plans: LagoPlan[] }>({
      method: 'get',
      url: '/plans',
    });

    return response.plans ?? [];
  }

  verifyWebhook(payload: string, signature: string): LagoWebhookEvent {
    if (!this.billingConfig.lagoWebhookSecret) {
      throw new ServiceUnavailableException('LAGO_WEBHOOK_SECRET not configured');
    }

    const expected = createHmac('sha256', this.billingConfig.lagoWebhookSecret)
      .update(payload)
      .digest('hex');

    const received = this.extractSignature(signature);
    if (!received) {
      throw new BadRequestException('Missing Lago webhook signature');
    }

    const expectedBuffer = Buffer.from(expected, 'hex');
    const receivedBuffer = Buffer.from(received, 'hex');

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      throw new BadRequestException('Invalid Lago webhook signature');
    }

    try {
      return JSON.parse(payload) as LagoWebhookEvent;
    } catch {
      throw new BadRequestException('Invalid Lago webhook payload');
    }
  }

  private extractSignature(rawSignature: string): string | null {
    const value = rawSignature.trim();
    if (!value) {
      return null;
    }

    if (!value.includes('=')) {
      return value;
    }

    const matches = value.split(',').find(part => part.trim().startsWith('v1='));
    if (!matches) {
      return null;
    }

    return matches.split('=').slice(1).join('=').trim() || null;
  }

  private ensureEnabled(): void {
    if (!this.billingConfig.lagoEnabled) {
      throw new ServiceUnavailableException('Lago billing is not configured');
    }
  }

  private async request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.request<T>({
        ...config,
        url: `/api/v1${config.url}`,
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Lago API request failed for ${config.method?.toUpperCase()} ${config.url}`);
      throw error;
    }
  }

  private extractUsageValue(payload: Record<string, unknown>, metricCode: string): number {
    const candidates = this.collectUsageCandidates(payload);

    for (const entry of candidates) {
      const code = this.pickString(entry, ['code', 'metric_code', 'billable_metric_code']);
      if (code !== metricCode) continue;

      const value = this.pickNumber(entry, [
        'units',
        'value',
        'amount',
        'total_units',
        'current_usage_units',
      ]);
      if (value != null) {
        return value;
      }
    }

    const mapValue = payload[metricCode];
    if (typeof mapValue === 'number') return mapValue;
    if (typeof mapValue === 'string') {
      const parsed = parseFloat(mapValue);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    return 0;
  }

  private collectUsageCandidates(payload: Record<string, unknown>): Array<Record<string, unknown>> {
    const roots = [
      payload.usages,
      payload.current_usage,
      (payload.customer as Record<string, unknown> | undefined)?.current_usage,
      payload.metrics,
    ];

    const out: Array<Record<string, unknown>> = [];
    for (const root of roots) {
      if (!Array.isArray(root)) continue;
      for (const item of root) {
        if (item && typeof item === 'object') {
          out.push(item as Record<string, unknown>);
        }
      }
    }

    return out;
  }

  private pickString(
    value: Record<string, unknown>,
    keys: string[]
  ): string | null {
    for (const key of keys) {
      const current = value[key];
      if (typeof current === 'string' && current.length > 0) {
        return current;
      }
    }
    return null;
  }

  private pickNumber(
    value: Record<string, unknown>,
    keys: string[]
  ): number | null {
    for (const key of keys) {
      const current = value[key];
      if (typeof current === 'number' && Number.isFinite(current)) {
        return current;
      }
      if (typeof current === 'string') {
        const parsed = parseFloat(current);
        if (Number.isFinite(parsed)) {
          return parsed;
        }
      }
    }
    return null;
  }
}
