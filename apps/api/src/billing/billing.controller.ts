import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SkipThrottle } from '@nestjs/throttler';
import type { InvoiceListResponse, Plan } from '@pytholit/contracts';
import type { Request } from 'express';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { InternalApiKeyGuard } from '../common/guards/internal-api-key.guard';
import { BILLING_ERROR_CODE } from './billing-error-codes';
import { BillingFacadeService } from './billing-facade.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { CreateTopupSessionDto } from './dto/create-topup-session.dto';
import { FinalizeCheckoutDto } from './dto/finalize-checkout.dto';
import { ReportUsageDto } from './dto/report-usage.dto';
import { StripeCustomerService } from './stripe-customer.service';
import { StripeUsageService } from './stripe-usage.service';
import { getSingleHeader } from './utils/http-header.utils';
import { toMeterValue } from './utils/usage-value.utils';

@Controller('billing')
export class BillingController {
  constructor(
    private readonly billing: BillingFacadeService,
    private readonly config: ConfigService,
    private readonly stripeCustomers: StripeCustomerService,
    private readonly stripeUsage: StripeUsageService
  ) {}

  private isEnabled(flagName: string, defaultValue: boolean): boolean {
    const raw = this.config.get<boolean | string>(flagName);
    if (typeof raw === 'boolean') return raw;
    if (typeof raw === 'string') {
      const normalized = raw.trim().toLowerCase();
      if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
      if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
    }
    return defaultValue;
  }

  @Public()
  @Get('plans')
  async plans(): Promise<Plan[]> {
    return this.billing.getPlans();
  }

  @Get('subscription')
  async subscription(@CurrentUser('id') userId: string) {
    return this.billing.getSubscriptionResponse(userId);
  }

  @Get('invoices')
  async invoices(
    @CurrentUser('id') userId: string,
    @Query('limit') limitQuery?: string,
    @Query('startingAfter') startingAfter?: string
  ): Promise<InvoiceListResponse> {
    const parsed = Number(limitQuery);
    const limit = Number.isFinite(parsed) ? parsed : 25;
    return this.billing.getInvoices(userId, limit, startingAfter);
  }

  /** Returns Stripe billing credits balance for the authenticated user. */
  @Get('wallet')
  async wallet(@CurrentUser('id') userId: string): Promise<{ amount: string; currency: 'USD' }> {
    if (!this.isEnabled('BILLING_USE_STRIPE_CREDITS', true)) {
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.BILLING_ENGINE_ERROR,
        detail: 'Stripe credits are disabled by configuration.',
      });
    }
    const stripeCustomerId = await this.stripeCustomers.getOrCreateStripeCustomerIdForUser(userId);
    if (!stripeCustomerId) {
      throw new BadRequestException({
        code: BILLING_ERROR_CODE.BILLING_STRIPE_CUSTOMER_NOT_FOUND,
        detail: 'Stripe customer is required.',
      });
    }
    return this.stripeUsage.getCreditBalance(stripeCustomerId);
  }

  @Post('checkout')
  async checkout(@CurrentUser('id') userId: string, @Body() dto: CreateCheckoutSessionDto) {
    return this.billing.createCheckoutSession(userId, dto.planId, dto.interval);
  }

  @Post('checkout/finalize')
  async finalize(@CurrentUser('id') userId: string, @Body() dto: FinalizeCheckoutDto) {
    return this.billing.finalizeCheckoutSession(userId, dto.pendingPlanCode);
  }

  @Post('portal')
  async portal(@CurrentUser('id') userId: string) {
    return this.billing.createPortalSession(userId);
  }

  @Post('topup')
  async topup(@CurrentUser('id') userId: string, @Body() dto: CreateTopupSessionDto) {
    return this.billing.createCreditTopupSession(userId, dto.amountUsd);
  }

  /**
   * Ingest a usage event into Stripe Meters.
   * Internal-only endpoint secured by InternalApiKeyGuard.
   */
  @Public()
  @UseGuards(InternalApiKeyGuard)
  @Post('usage/report')
  async reportUsage(@Body() dto: ReportUsageDto): Promise<{ queued: true }> {
    if (!this.isEnabled('BILLING_USE_STRIPE_USAGE', true)) {
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.BILLING_ENGINE_ERROR,
        detail: 'Stripe usage reporting is disabled by configuration.',
      });
    }
    const stripeCustomerId = await this.stripeCustomers.getOrCreateStripeCustomerIdForUser(
      dto.userId
    );
    if (!stripeCustomerId) {
      throw new BadRequestException({
        code: BILLING_ERROR_CODE.BILLING_STRIPE_CUSTOMER_NOT_FOUND,
        detail: 'Stripe customer is required.',
      });
    }

    const value = toMeterValue(dto.eventName, dto.properties);
    await this.stripeUsage.reportUsage({
      externalCustomerId: dto.userId,
      stripeCustomerId,
      eventName: dto.eventName,
      value,
      idempotencyKey: dto.idempotencyKey,
      timestamp: dto.timestamp ? new Date(dto.timestamp) : new Date(),
    });
    return { queued: true };
  }

  @Public()
  @Post('webhook')
  @HttpCode(200)
  @SkipThrottle()
  async webhook(@Req() req: Request) {
    const sig = getSingleHeader(
      req.headers as Record<string, string | string[] | undefined>,
      'stripe-signature'
    );
    const rawBody = req.body;
    if (!Buffer.isBuffer(rawBody)) {
      throw new BadRequestException({
        code: BILLING_ERROR_CODE.STRIPE_WEBHOOK_RAW_BODY_REQUIRED,
        detail: 'Stripe webhook requires raw request body Buffer.',
      });
    }
    await this.billing.receiveStripeWebhook(rawBody, sig || undefined);
    return { received: true };
  }
}
