/**
 * Common API response types
 */

export interface ApiSuccessResponse<T = unknown> {
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

export interface ValidationErrorResponse {
  error: {
    message: string;
    code: 'VALIDATION_ERROR';
    details: ValidationError[];
  };
  statusCode: 422;
}
