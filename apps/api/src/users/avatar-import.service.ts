import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';

import { readTrimmedStringOrDefault } from '../config/config-readers';
import { UPLOAD_DIR_DEFAULT } from '../config/defaults';
import { PrismaService } from '../database/prisma.service';

const MAX_BYTES = 2 * 1024 * 1024; // 2MB (matches manual upload)
const TIMEOUT_MS = 5000;

const ALLOWED_HOSTS = new Set([
  // Google profile photos
  'lh3.googleusercontent.com',
  'lh4.googleusercontent.com',
  'lh5.googleusercontent.com',
  'lh6.googleusercontent.com',
  // GitHub avatars
  'avatars.githubusercontent.com',
]);

function isAllowedUrl(url: URL): boolean {
  if (url.protocol !== 'https:') return false;
  const host = url.hostname.toLowerCase();
  return ALLOWED_HOSTS.has(host);
}

function extFromContentType(contentType: string | null): string | null {
  if (!contentType) return null;
  const ct = contentType.split(';')[0]?.trim().toLowerCase();
  if (ct === 'image/jpeg') return '.jpg';
  if (ct === 'image/png') return '.png';
  if (ct === 'image/webp') return '.webp';
  return null;
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { redirect: 'follow', signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

@Injectable()
export class AvatarImportService {
  private readonly logger = new Logger(AvatarImportService.name);
  private readonly uploadDir: string;

  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService
  ) {
    this.uploadDir = readTrimmedStringOrDefault(configService, 'UPLOAD_DIR', UPLOAD_DIR_DEFAULT);
  }

  async importAvatarIfMissing(userId: string, avatarUrl: string): Promise<void> {
    const user = await this.prisma.client.user.findUnique({ where: { id: userId } });
    if (!user) return;
    if (user.avatarUrl) return;

    let initial: URL;
    try {
      initial = new URL(avatarUrl);
    } catch {
      return;
    }
    if (!isAllowedUrl(initial)) return;

    try {
      const res = await fetchWithTimeout(initial.toString(), TIMEOUT_MS);
      const finalUrl = new URL(res.url);
      if (!isAllowedUrl(finalUrl)) {
        this.logger.warn(`Avatar redirect blocked for user=${userId}`);
        return;
      }

      if (!res.ok) return;
      const contentType = res.headers.get('content-type');
      const ext = extFromContentType(contentType);
      if (!ext) return;

      const contentLength = res.headers.get('content-length');
      if (contentLength) {
        const len = Number(contentLength);
        if (Number.isFinite(len) && len > MAX_BYTES) return;
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.byteLength > MAX_BYTES) return;

      const avatarsDir = path.join(process.cwd(), this.uploadDir, 'avatars');
      await fs.mkdir(avatarsDir, { recursive: true });

      const timestamp = Date.now();
      const rand = crypto.randomBytes(6).toString('hex');
      const filename = `oauth-${userId}-${timestamp}-${rand}${ext}`;
      const filepath = path.join(avatarsDir, filename);
      await fs.writeFile(filepath, buffer);

      const storedUrl = `/${this.uploadDir}/avatars/${filename}`;
      await this.prisma.client.user.update({
        where: { id: userId },
        data: { avatarUrl: storedUrl },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Avatar import failed for user=${userId}: ${msg}`);
    }
  }
}
