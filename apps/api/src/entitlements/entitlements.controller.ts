import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RecordEntitlementUsageDto } from './dto/record-usage.dto';
import { EntitlementsService } from './entitlements.service';

@Controller('entitlements')
export class EntitlementsController {
  constructor(private readonly entitlementsService: EntitlementsService) {}

  @Get('limits')
  async getLimits(@CurrentUser('id') userId: string) {
    return this.entitlementsService.getLimits(userId);
  }

  @Post('usage')
  @HttpCode(HttpStatus.CREATED)
  async recordUsage(
    @CurrentUser('id') userId: string,
    @Body() body: RecordEntitlementUsageDto
  ) {
    return this.entitlementsService.recordUsage(
      userId,
      body.featureId,
      body.amount,
      body.operationId
    );
  }
}
