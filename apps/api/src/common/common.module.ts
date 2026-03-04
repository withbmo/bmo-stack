import { Global, Module } from '@nestjs/common';

import { InternalApiKeyGuard } from './guards/internal-api-key.guard';
import { DistributedLockService } from './services/distributed-lock.service';
import { TurnstileService } from './services/turnstile.service';

@Global()
@Module({
  providers: [TurnstileService, DistributedLockService, InternalApiKeyGuard],
  exports: [TurnstileService, DistributedLockService, InternalApiKeyGuard],
})
export class CommonModule {}
