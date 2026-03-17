import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

type BetterAuthApiErrorLike = {
  name?: unknown;
  statusCode?: unknown;
  status?: unknown;
  message?: unknown;
  body?: unknown;
};

function sanitizeForLog(input: string): string {
  return input.replace(/[\r\n\t]/g, '_').substring(0, 1000);
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (!request || !response) {
      this.logger.error('graphql_error', { error: exception });
      throw exception;
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as any)?.message || exception.message
        : 'Internal server error';

    if (this.isBetterAuthApiError(exception)) {
      const statusCode = this.resolveBetterAuthStatusCode(exception);
      const body = this.asRecord(exception.body);
      const code = this.asNonEmptyString(body?.code) ?? 'AUTH_REQUEST_FAILED';
      const detail =
        this.asNonEmptyString(body?.detail) ??
        this.asNonEmptyString(body?.message) ??
        this.asNonEmptyString(exception.message) ??
        'Authentication request failed.';

      this.logException(exception, request, statusCode);
      response.status(statusCode).json({ code, detail });
      return;
    }

    this.logException(exception, request, status);

    const errorResponse = {
      success: false,
      statusCode: status,
      error:
        exception instanceof HttpException
          ? exception.name
          : 'Internal Server Error',
      message,
      path: request?.url || '/unknown',
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }

  private isBetterAuthApiError(error: unknown): error is BetterAuthApiErrorLike {
    if (!error || typeof error !== 'object') return false;
    const candidate = error as BetterAuthApiErrorLike;
    if (candidate.name !== 'APIError') return false;
    return typeof candidate.statusCode === 'number' || typeof candidate.body === 'object';
  }

  private resolveBetterAuthStatusCode(error: BetterAuthApiErrorLike): number {
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

  private logException(exception: unknown, request: Request, status: number) {
    const method = request?.method || 'UNKNOWN';
    const url = request?.url || '/unknown';
    const timestamp = new Date().toISOString();
    const logContext = { method, url, statusCode: status, timestamp };

    if (exception instanceof HttpException) {
      const sanitizedUrl = sanitizeForLog(url);
      const logMessage = `HTTP Exception: ${method} ${sanitizedUrl} - ${status}`;

      if (status >= 500) {
        this.logger.error(logMessage, {
          ...logContext,
          error: exception.message,
          stack: exception.stack,
          response: exception.getResponse(),
        });
      } else if (status >= 400) {
        this.logger.warn(logMessage, {
          ...logContext,
          error: exception.message,
        });
      } else {
        this.logger.log(logMessage, logContext);
      }
    } else if (exception instanceof Error) {
      const sanitizedUrl = sanitizeForLog(url);
      const sanitizedMsg = sanitizeForLog(exception.message);
      this.logger.error(
        `Unhandled Error: ${method} ${sanitizedUrl} - ${status}`,
        {
          ...logContext,
          error: sanitizedMsg,
          stack: exception.stack,
          name: exception.name,
        }
      );
    } else {
      const sanitizedUrl = sanitizeForLog(url);
      const sanitizedErr = sanitizeForLog(String(exception));
      this.logger.error(
        `Unknown Exception: ${method} ${sanitizedUrl} - ${status}`,
        {
          ...logContext,
          error: sanitizedErr,
          type: typeof exception,
        }
      );
    }
  }
}
