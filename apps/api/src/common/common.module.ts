import { Global, Module } from '@nestjs/common';

import { DistributedLockService } from './services/distributed-lock.service.js';

@Global()
@Module({
  providers: [DistributedLockService],
  exports: [DistributedLockService],
})
export class CommonModule {}
