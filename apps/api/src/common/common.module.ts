import { Global, Module } from '@nestjs/common';

import { InternalApiKeyGuard } from './guards/internal-api-key.guard';
import { DistributedLockService } from './services/distributed-lock.service';
import { FeatureFlagService } from './services/feature-flag.service';
import { TurnstileService } from './services/turnstile.service';

@Global()
@Module({
  providers: [TurnstileService, DistributedLockService, InternalApiKeyGuard, FeatureFlagService],
  exports: [TurnstileService, DistributedLockService, InternalApiKeyGuard, FeatureFlagService],
})
export class CommonModule {}
