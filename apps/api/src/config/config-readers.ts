import type { ConfigService } from '@nestjs/config';

type ConfigGetter = Pick<ConfigService, 'get'>;

export function readTrimmedString(config: ConfigGetter, key: string): string | undefined {
  const raw = config.get<string>(key);
  if (typeof raw !== 'string') return undefined;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function readTrimmedStringOrDefault(
  config: ConfigGetter,
  key: string,
  defaultValue: string
): string {
  return readTrimmedString(config, key) ?? defaultValue;
}

export function readTrimmedStringOrEmpty(config: ConfigGetter, key: string): string {
  return readTrimmedString(config, key) ?? '';
}
