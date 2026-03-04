export function sanitizeErrorForLog(err: unknown, maxLength = 2000): string {
  const message = err instanceof Error ? err.message : String(err);
  return message.replace(/[\r\n\t]/g, '_').slice(0, Math.max(1, maxLength));
}
