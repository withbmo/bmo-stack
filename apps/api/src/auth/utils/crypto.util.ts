import { createCipheriv, hkdfSync, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const DELIMITER = ':';
const HKDF_INFO = 'pytholit-token-encryption-v1';

/** Versioned prefix that unambiguously marks an encrypted value. */
export const ENCRYPTED_PREFIX = 'enc:v1:';

/** Returns true if the value was produced by `encryptToken`. */
export function isEncrypted(value: string): boolean {
  return value.startsWith(ENCRYPTED_PREFIX);
}

/** Derives a 32-byte AES-256 key from the master secret using HKDF-SHA256. */
function deriveKey(secret: string): Buffer {
  return Buffer.from(
    hkdfSync('sha256', secret, '', HKDF_INFO, 32)
  );
}

/** Encrypts a plain text string using AES-256-GCM. */
export function encryptToken(text: string, secret: string): string {
  const iv = randomBytes(IV_LENGTH);
  const key = deriveKey(secret);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${ENCRYPTED_PREFIX}${iv.toString('hex')}${DELIMITER}${authTag.toString('hex')}${DELIMITER}${encrypted.toString('hex')}`;
}
