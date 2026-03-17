import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';

import { STORAGE_DRIVER_DEFAULT, UPLOAD_DIR_DEFAULT } from '../config/defaults.js';

interface UploadResult {
  key: string;
  publicUrl: string;
}

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly driver: string;
  private s3: S3Client | null = null;
  private readonly s3Bucket: string;
  private readonly s3PublicUrl: string;
  private readonly uploadDir: string;

  constructor(private readonly config: ConfigService) {
    this.driver = this.config.get<string>('STORAGE_DRIVER') ?? STORAGE_DRIVER_DEFAULT;
    this.uploadDir = this.config.get<string>('UPLOAD_DIR') ?? UPLOAD_DIR_DEFAULT;
    this.s3Bucket = this.config.get<string>('S3_BUCKET') ?? '';
    this.s3PublicUrl = (this.config.get<string>('S3_PUBLIC_URL') ?? '').replace(/\/$/, '');
  }

  onModuleInit() {
    if (this.driver === 's3') {
      const endpoint = this.config.get<string>('S3_ENDPOINT') ?? '';
      const region = this.config.get<string>('S3_REGION') ?? 'us-east-1';
      const accessKeyId = this.config.get<string>('S3_ACCESS_KEY_ID') ?? '';
      const secretAccessKey = this.config.get<string>('S3_SECRET_ACCESS_KEY') ?? '';
      const forcePathStyle = this.config.get<boolean>('S3_FORCE_PATH_STYLE') ?? false;

      this.s3 = new S3Client({
        region,
        ...(endpoint ? { endpoint } : {}),
        forcePathStyle,
        ...(accessKeyId && secretAccessKey
          ? { credentials: { accessKeyId, secretAccessKey } }
          : {}),
      });

      this.logger.log(`StorageService: s3 driver (bucket=${this.s3Bucket}${endpoint ? `, endpoint=${endpoint}` : ''})`);
    } else {
      this.logger.log(`StorageService: local driver (uploadDir=${this.uploadDir})`);
    }
  }

  async uploadFile(key: string, buffer: Buffer, contentType: string): Promise<UploadResult> {
    if (this.driver === 's3') {
      return this.uploadToS3(key, buffer, contentType);
    }
    return this.uploadToLocal(key, buffer);
  }

  async deleteFile(key: string): Promise<void> {
    if (this.driver === 's3') {
      await this.deleteFromS3(key);
    } else {
      await this.deleteFromLocal(key);
    }
  }

  resolvePublicUrl(key: string): string {
    if (this.driver === 's3') {
      return `${this.s3PublicUrl}/${key}`;
    }
    return `/${this.uploadDir}/${key}`;
  }

  private async uploadToS3(key: string, buffer: Buffer, contentType: string): Promise<UploadResult> {
    await this.s3!.send(
      new PutObjectCommand({
        Bucket: this.s3Bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    );
    return { key, publicUrl: this.resolvePublicUrl(key) };
  }

  private async deleteFromS3(key: string): Promise<void> {
    await this.s3!.send(
      new DeleteObjectCommand({ Bucket: this.s3Bucket, Key: key })
    );
  }

  private async uploadToLocal(key: string, buffer: Buffer): Promise<UploadResult> {
    const filepath = path.join(process.cwd(), this.uploadDir, key);
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, buffer);
    return { key, publicUrl: this.resolvePublicUrl(key) };
  }

  private async deleteFromLocal(key: string): Promise<void> {
    const filepath = path.join(process.cwd(), this.uploadDir, key);
    try {
      await fs.unlink(filepath);
    } catch {
      // ignore ENOENT
    }
  }
}
