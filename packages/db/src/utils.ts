/**
 * Database utility functions
 */

import { Prisma } from './generated/client';

/**
 * Handle Prisma errors and convert to user-friendly messages
 */
export function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (error.code === 'P2002') {
      const target = (error.meta?.target as string[]) || [];
      throw new Error(`A record with this ${target.join(', ')} already exists`);
    }

    // Foreign key constraint failed
    if (error.code === 'P2003') {
      throw new Error('Related record not found');
    }

    // Record not found
    if (error.code === 'P2025') {
      throw new Error('Record not found');
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    throw new Error('Invalid data provided');
  }

  // Re-throw unknown errors
  throw error;
}

/**
 * Create pagination metadata
 */
export interface PaginationParams {
  page?: number;
  perPage?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function createPaginationMeta(
  total: number,
  params: Required<PaginationParams>
): PaginationMeta {
  const totalPages = Math.ceil(total / params.perPage);

  return {
    total,
    page: params.page,
    perPage: params.perPage,
    totalPages,
    hasNext: params.page < totalPages,
    hasPrev: params.page > 1,
  };
}

/**
 * Calculate skip value for pagination
 */
export function calculateSkip(page: number, perPage: number): number {
  return (page - 1) * perPage;
}

/**
 * Exclude fields from an object (useful for removing sensitive fields)
 */
export function exclude<T, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}
