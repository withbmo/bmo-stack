import { Controller, Get } from '@nestjs/common';

import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { AdminOverviewService } from '../services/admin-overview.service';

@Controller('admin')
export class AdminOverviewController {
  constructor(private readonly overview: AdminOverviewService) {}

  @Get('overview')
  @RequirePermissions('admin.access')
  async getOverview() {
    return this.overview.getOverview();
  }
}

