import { Controller, Get } from '@nestjs/common';
import { UseAbility } from 'nest-casl';

import { UserSubject } from '../../auth-admin/casl/subjects';
import { AdminOverviewService } from '../services/admin-overview.service';

@Controller('admin')
export class AdminOverviewController {
  constructor(private readonly overview: AdminOverviewService) {}

  @Get('overview')
  @UseAbility('read', UserSubject) // Admin overview requires at least user read permission
  async getOverview() {
    return this.overview.getOverview();
  }
}
