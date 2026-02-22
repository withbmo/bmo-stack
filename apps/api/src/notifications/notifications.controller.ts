import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PrismaService } from '../database/prisma.service';

/**
 * Notifications controller for Novu inbox integration.
 * GET /notifications/token returns subscriber_id for the Novu React provider.
 * Returns 503 when Novu is not configured.
 */
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  @Get('token')
  async getToken(@CurrentUser('id') userId: string): Promise<{
    subscriber_id: string;
    subscriber_hash: string;
  }> {
    const novuApiKey = this.config.get<string>('NOVU_API_KEY');
    if (!novuApiKey || novuApiKey.trim() === '') {
      throw new ServiceUnavailableException('Notifications are not configured');
    }
    const subscriberHashSecret = this.config.get<string>('NOVU_SUBSCRIBER_HASH_SECRET');
    if (!subscriberHashSecret || subscriberHashSecret.trim() === '') {
      throw new ServiceUnavailableException('NOVU_SUBSCRIBER_HASH_SECRET is not configured');
    }

    const dbUser = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: { novuSubscriberId: true },
    });

    const subscriberId = dbUser?.novuSubscriberId ?? userId;
    const subscriberHash = createHmac('sha256', subscriberHashSecret).update(subscriberId).digest('hex');
    return {
      subscriber_id: subscriberId,
      subscriber_hash: subscriberHash,
    };
  }
}
