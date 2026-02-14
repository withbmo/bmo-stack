import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RecordEntitlementUsageDto } from './dto/record-usage.dto';
import { EntitlementsService } from './entitlements.service';

@Controller('entitlements')
export class EntitlementsController {
  constructor(private readonly entitlementsService: EntitlementsService) {}

  @Get('limits')
  async getLimits(@CurrentUser() user: any) {
    return this.entitlementsService.getLimits(user.id);
  }

  @Post('usage')
  @HttpCode(HttpStatus.CREATED)
  async recordUsage(
    @CurrentUser() user: any,
    @Body() body: RecordEntitlementUsageDto
  ) {
    return this.entitlementsService.recordUsage(user.id, body.featureId, body.amount);
  }
}
