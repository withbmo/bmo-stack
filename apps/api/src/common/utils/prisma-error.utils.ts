import { Prisma } from '@pytholit/db';

export function isPrismaUniqueViolation(err: unknown): boolean {
  const code = (err as Prisma.PrismaClientKnownRequestError | { code?: unknown } | null)?.code;
  return code === 'P2002';
}
