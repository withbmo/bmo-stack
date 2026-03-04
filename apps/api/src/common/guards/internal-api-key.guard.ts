import { timingSafeEqual } from 'crypto';

import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

/**
 * Guard that restricts an endpoint to internal backend-to-backend calls only.
 *
 * Callers must pass the INTERNAL_SECRET value in the `x-internal-key` header.
 * Uses `crypto.timingSafeEqual` to prevent timing attacks.
 *
 * Usage:
 *   @UseGuards(InternalApiKeyGuard)
 *   @Post('usage/report')
 *   async reportUsage(...) { ... }
 */
@Injectable()
export class InternalApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const secret = (this.config.get<string>('INTERNAL_SECRET') ?? '').trim();
    if (!secret) {
      throw new UnauthorizedException({ code: 'INTERNAL_SECRET_NOT_CONFIGURED' });
    }

    const request = context.switchToHttp().getRequest<Request>();
    const header = request.headers['x-internal-key'];
    const incoming = (Array.isArray(header) ? header[0] : header) ?? '';

    const secretBuf = Buffer.from(secret);
    const incomingBuf = Buffer.from(incoming);

    if (
      secretBuf.length !== incomingBuf.length ||
      !timingSafeEqual(secretBuf, incomingBuf)
    ) {
      throw new UnauthorizedException({ code: 'INTERNAL_KEY_INVALID' });
    }

    return true;
  }
}
