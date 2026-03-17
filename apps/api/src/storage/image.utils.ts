import { BadRequestException } from '@nestjs/common';
import sharp from 'sharp';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function validateAndProcessAvatar(buffer: Buffer): Promise<Buffer> {
  const { fileTypeFromBuffer } = await import('file-type');

  const detected = await fileTypeFromBuffer(buffer);
  if (!detected || !ALLOWED_MIME_TYPES.has(detected.mime)) {
    throw new BadRequestException('Invalid image type. Only JPEG, PNG, and WebP are allowed.');
  }

  return sharp(buffer)
    .resize(400, 400, { fit: 'cover', position: 'centre' })
    .webp({ quality: 85 })
    .withMetadata({})
    .toBuffer();
}
