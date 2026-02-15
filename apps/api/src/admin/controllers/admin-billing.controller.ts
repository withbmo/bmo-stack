import { Controller, Get, Query } from '@nestjs/common';

import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { PaginationDto } from '../dto/pagination.dto';
import { AdminBillingService } from '../services/admin-billing.service';

@Controller('admin/billing')
@RequirePermissions('admin.access', 'admin.billing.read')
export class AdminBillingController {
  constructor(private readonly billing: AdminBillingService) {}

  @Get('subscriptions')
  async subscriptions(@Query() q: PaginationDto) {
    return this.billing.listSubscriptions({ page: q.page, pageSize: q.pageSize });
  }

  @Get('invoices')
  async invoices(@Query() q: PaginationDto) {
    return this.billing.listInvoices({ page: q.page, pageSize: q.pageSize });
  }
}

