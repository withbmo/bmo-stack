import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  type RawBodyRequest,
  Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { BillingService } from './billing.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { RecordUsageDto } from './dto/record-usage.dto';
import { ValidatePaymentMethodDto } from './dto/validate-payment-method.dto';
import { StripeService } from './stripe.service';

/**
 * Billing Controller
 * Handles subscription and payment endpoints
 */
@Controller('billing')
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService
  ) {}

  @Post('checkout')
  @HttpCode(HttpStatus.OK)
  async createCheckout(
    @CurrentUser() user: any,
    @Body() body: CreateCheckoutDto
  ): Promise<{ sessionId: string; url: string }> {
    return this.billingService.createCheckoutSession(
      user.id,
      body.planId,
      body.interval ?? 'month'
    );
  }

  @Post('portal')
  @HttpCode(HttpStatus.OK)
  async createPortal(@CurrentUser() user: any): Promise<{ url: string }> {
    return this.billingService.createPortalSession(user.id);
  }

  @Get('subscription')
  async getSubscription(@CurrentUser() user: any) {
    return this.billingService.getSubscription(user.id);
  }

  @Get('invoices')
  async getInvoices(
    @CurrentUser() user: any,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const offsetNum = offset ? parseInt(offset, 10) : 0;
    return this.billingService.getUserInvoices(user.id, limitNum, offsetNum);
  }

  @Public()
  @Get('plans')
  async getPlans() {
    return this.billingService.getActivePlans();
  }

  @Get('payment-methods')
  async getPaymentMethods(@CurrentUser() user: any) {
    return this.billingService.getUserPaymentMethods(user.id);
  }

  @Post('validate-card')
  @HttpCode(HttpStatus.OK)
  async validateCard(
    @CurrentUser() user: any,
    @Body() body: ValidatePaymentMethodDto
  ) {
    return this.billingService.validatePaymentMethod(user.id, body.paymentMethodId);
  }

  @Post('usage')
  @HttpCode(HttpStatus.CREATED)
  async recordUsage(
    @CurrentUser() user: any,
    @Body() body: RecordUsageDto
  ) {
    return this.billingService.recordUsage(user.id, body);
  }

  /**
   * Stripe webhook endpoint
   * IMPORTANT: This endpoint must be configured to receive raw body
   */
  @Public()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string
  ): Promise<{ received: boolean }> {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    if (!webhookSecret) {
      throw new Error('Stripe webhook secret not configured');
    }

    if (!signature) {
      throw new Error('Missing Stripe signature');
    }

    // Get raw body (provided by express.raw middleware on this route)
    const rawBody = (req as any).rawBody ?? (req as any).body;
    if (!rawBody) {
      throw new Error('Missing raw body');
    }

    // Verify webhook signature
    const event = this.stripeService.constructWebhookEvent(
      rawBody,
      signature,
      webhookSecret
    );

    // Handle event
    await this.billingService.handleWebhookEvent(event);

    return { received: true };
  }
}
