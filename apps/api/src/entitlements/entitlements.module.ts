import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { EntitlementsController } from './entitlements.controller';
import { EntitlementsService } from './entitlements.service';

@Module({
  imports: [DatabaseModule],
  controllers: [EntitlementsController],
  providers: [EntitlementsService],
  exports: [EntitlementsService],
})
export class EntitlementsModule {}
