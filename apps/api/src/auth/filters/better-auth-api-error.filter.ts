import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import type { Response } from 'express';

type BetterAuthApiErrorLike = {
  name?: unknown;
  statusCode?: unknown;
  status?: unknown;
  message?: unknown;
  body?: unknown;
};

@Catch()
export class BetterAuthApiErrorFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== 'http' || !this.isBetterAuthApiError(exception)) {
      super.catch(exception, host);
      return;
    }

    const response = host.switchToHttp().getResponse<Response>();
    const body = this.asRecord(exception.body);

    const statusCode = this.resolveStatusCode(exception);
    const code = this.asNonEmptyString(body?.code) ?? 'AUTH_REQUEST_FAILED';
    const detail =
      this.asNonEmptyString(body?.detail) ??
      this.asNonEmptyString(body?.message) ??
      this.asNonEmptyString(exception.message) ??
      'Authentication request failed.';

    response.status(statusCode).json({ code, detail });
  }

  private isBetterAuthApiError(error: unknown): error is BetterAuthApiErrorLike {
    if (!error || typeof error !== 'object') return false;
    const candidate = error as BetterAuthApiErrorLike;
    if (candidate.name !== 'APIError') return false;
    return typeof candidate.statusCode === 'number' || typeof candidate.body === 'object';
  }

  private resolveStatusCode(error: BetterAuthApiErrorLike): number {
    if (typeof error.statusCode === 'number' && this.isValidHttpStatus(error.statusCode)) {
      return error.statusCode;
    }

    if (typeof error.status === 'number' && this.isValidHttpStatus(error.status)) {
      return error.status;
    }

    return HttpStatus.BAD_REQUEST;
  }

  private isValidHttpStatus(status: number): boolean {
    return Number.isInteger(status) && status >= 400 && status <= 599;
  }

  private asRecord(value: unknown): Record<string, unknown> | null {
    return value && typeof value === 'object' ? (value as Record<string, unknown>) : null;
  }

  private asNonEmptyString(value: unknown): string | null {
    return typeof value === 'string' && value.trim().length > 0 ? value : null;
  }
}
