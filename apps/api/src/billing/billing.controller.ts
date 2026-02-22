import {
  BadRequestException,
  Body,
  Controller,
  Get,
  GoneException,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  type RawBodyRequest,
  Req,
} from '@nestjs/common';
import type {
  PlanChangeApplyResponse,
  PlanChangePreviewResponse,
  PublicPlan,
} from '@pytholit/contracts';
import type { Request } from 'express';
import { randomUUID } from 'crypto';
import { getCreditsForUsd } from '@pytholit/config';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { BillingConfigService } from './billing.config';
import type { PaymentMethodResponse, ValidatePaymentMethodResult } from './billing.types';
import { BillingFacadeService } from './billing-facade.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { FinalizeCheckoutDto } from './dto/finalize-checkout.dto';
import { PurchaseCreditsDto } from './dto/purchase-credits.dto';
import { RecordUsageDto } from './dto/record-usage.dto';
import { RetryCreditTopupDto } from './dto/retry-credit-topup.dto';
import { ValidatePaymentMethodDto } from './dto/validate-payment-method.dto';
import { PlanChangeApplyDto } from './dto/plan-change-apply.dto';
import { PlanChangePreviewDto } from './dto/plan-change-preview.dto';
import { LagoService } from './lago.service';
import { WebhookQueue } from './webhook.queue';

@Controller('billing')
export class BillingController {
  constructor(
    private readonly billingFacade: BillingFacadeService,
    private readonly lagoService: LagoService,
    private readonly billingConfig: BillingConfigService,
    private readonly webhookQueue: WebhookQueue
  ) {}

  @Post('checkout')
  @HttpCode(HttpStatus.OK)
  async createCheckout(
    @CurrentUser('id') userId: string,
    @Body() body: CreateCheckoutDto
  ): Promise<{
    requiresPaymentMethod: boolean;
    paymentSetupUrl?: string;
    pendingPlanCode?: string;
    subscription?: { id: string; planCode: string; status: string };
    url?: string;
  }> {
    const planCode = `${body.planId}_${body.interval === 'year' ? 'yearly' : 'monthly'}`;
    return this.billingFacade.createCheckout(userId, planCode);
  }

  @Post('checkout/finalize')
  @HttpCode(HttpStatus.OK)
  async finalizeCheckout(
    @CurrentUser('id') userId: string,
    @Body() body: FinalizeCheckoutDto
  ): Promise<{
    status?: 'activated' | 'already_active' | 'requires_payment_method' | 'failed';
    requiresPaymentMethod: boolean;
    subscription?: { id: string; planCode: string; status: string };
    url?: string;
  }> {
    return this.billingFacade.finalizeCheckout(userId, body.pendingPlanCode);
  }

  @Post('portal')
  @HttpCode(HttpStatus.OK)
  async createPortal(@CurrentUser('id') userId: string): Promise<{ url: string }> {
    const url = await this.billingFacade.createPortalSession(userId);
    return { url };
  }

  @Get('subscription')
  async getSubscription(@CurrentUser('id') userId: string) {
    const subscription = await this.billingFacade.getSubscription(userId);
    return {
      rolloutEnabled: this.billingConfig.shouldUseLago(userId),
      subscription,
    };
  }

  @Get('invoices')
  async getInvoices(
    @CurrentUser('id') userId: string,
    @Query('limit') limit?: string
  ) {
    const limitNum = limit ? Math.max(1, Math.min(100, parseInt(limit, 10) || 20)) : 20;
    return this.billingFacade.getInvoices(userId, limitNum);
  }

  @Post('plan/change/preview')
  async previewPlanChange(
    @CurrentUser('id') userId: string,
    @Body() body: PlanChangePreviewDto
  ): Promise<PlanChangePreviewResponse> {
    return this.billingFacade.previewPlanChange(userId, body.targetPlanId, body.targetInterval);
  }

  @Post('plan/change/apply')
  async applyPlanChange(
    @CurrentUser('id') userId: string,
    @Body() body: PlanChangeApplyDto
  ): Promise<PlanChangeApplyResponse> {
    return this.billingFacade.applyPlanChange(
      userId,
      body.targetPlanId,
      body.targetInterval,
      body.previewId
    );
  }

  @Public()
  @Get('plans')
  async getPlans(): Promise<PublicPlan[]> {
    return this.billingFacade.getActivePlans();
  }

  @Get('payment-methods')
  async getPaymentMethods(
    @CurrentUser('id') userId: string
  ): Promise<PaymentMethodResponse[]> {
    return this.billingFacade.getPaymentMethods(userId);
  }

  @Post('validate-card')
  @HttpCode(HttpStatus.OK)
  async validateCard(
    @CurrentUser('id') userId: string,
    @Body() body: ValidatePaymentMethodDto
  ): Promise<ValidatePaymentMethodResult> {
    void userId;
    void body;
    throw new GoneException('This endpoint is deprecated. Use Lago checkout/portal flow.');
  }

  @Post('usage')
  @HttpCode(HttpStatus.CREATED)
  async recordUsage(@CurrentUser('id') userId: string, @Body() body: RecordUsageDto) {
    await this.billingFacade.recordUsage(userId, body.metricName, body.value, body.operationId);
    return { recorded: true };
  }

  @Public()
  @Post('webhook/lago')
  @HttpCode(HttpStatus.OK)
  async handleLagoWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-lago-signature') signature: string
  ): Promise<{ received: boolean }> {
    if (!signature) {
      throw new BadRequestException('Missing Lago signature');
    }

    const rawBody = req.rawBody ?? req.body;
    if (!rawBody) {
      throw new BadRequestException('Missing raw body');
    }

    // Verify signature first (fail fast if invalid)
    const payload = Buffer.isBuffer(rawBody) ? rawBody.toString('utf8') : String(rawBody);
    const event = this.lagoService.verifyWebhook(payload, signature);

    // Queue for async processing (instant response to Lago)
    await this.webhookQueue.queueLagoWebhook(event);

    return { received: true };
  }

  @Get('credits')
  async getCredits(
    @CurrentUser('id') userId: string
  ): Promise<{ walletBalance: number; currency: 'USD'; lastUpdatedAt: string }> {
    if (!this.billingConfig.shouldUseLago(userId)) {
      return { walletBalance: 0, currency: 'USD', lastUpdatedAt: new Date(0).toISOString() };
    }

    const walletBalance = await this.lagoService.getWalletBalance(userId);
    return { walletBalance, currency: 'USD', lastUpdatedAt: new Date().toISOString() };
  }

  @Post('credits/purchase')
  @HttpCode(HttpStatus.OK)
  async purchaseCredits(
    @CurrentUser('id') userId: string,
    @Body() body: PurchaseCreditsDto
  ): Promise<{
    credits: number;
    currency: 'USD';
    checkoutUrl: string;
    purchaseId: string;
    idempotencyKey: string;
  }> {
    if (!this.billingConfig.shouldUseLago(userId)) {
      throw new BadRequestException('Lago credits are not enabled for this account');
    }

    const amountUsd = body.amount;
    const credits = getCreditsForUsd(amountUsd);
    const idempotencyKey = randomUUID();
    const invoice = await this.lagoService.createOneOffInvoiceForCredits(userId, amountUsd, credits);
    const checkoutUrl = await this.lagoService.generateInvoicePaymentUrl(invoice.lago_id);
    const purchaseId = await this.billingFacade.registerCreditTopupRequest(
      userId,
      invoice.lago_id,
      amountUsd,
      credits,
      idempotencyKey
    );

    return {
      credits,
      currency: 'USD',
      checkoutUrl,
      purchaseId,
      idempotencyKey,
    };
  }

  @Post('credits/replay')
  @HttpCode(HttpStatus.OK)
  async retryCreditTopup(
    @CurrentUser('id') userId: string,
    @Body() body: RetryCreditTopupDto
  ): Promise<{ status: 'processed' | 'skipped' | 'failed' }> {
    const status = await this.billingFacade.retryFailedCreditTopup(userId, body.lagoInvoiceId);
    return { status };
  }

}
