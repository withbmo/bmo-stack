import { createHash, randomUUID } from 'crypto';
import WebSocket from 'ws';

// SSM Session Manager WebSocket message format:
//
//   4-byte header length prefix (uint32 BE, usually 116),
//   followed by a 116-byte header and payload.
//
//   Offset  Bytes  Field            Encoding
//   0       4      HeaderLength     uint32 BE  (usually 116)
//   4       32     MessageType      null-padded ASCII
//   36      4      SchemaVersion    uint32 BE  (always 1)
//   40      8      CreatedDate      uint64 BE  (Unix ms)
//   48      8      SequenceNumber   int64  BE
//   56      8      Flags            uint64 BE
//   64      16     MessageId        raw UUID bytes
//   80      32     PayloadDigest    SHA-256(payload) binary
//   112     4      PayloadType      uint32 BE
//   116     4      PayloadLength    uint32 BE
//   120+    var    Payload

const HEADER_LENGTH = 116; // excludes the 4-byte HeaderLength prefix itself
const HEADER_PREFIX_LENGTH = 4;
const FRAME_HEADER_LENGTH = HEADER_PREFIX_LENGTH + HEADER_LENGTH; // 120 bytes total before payload

// PayloadType values (match AWS Session Manager plugin)
export const PAYLOAD_TYPE_ACK = 0;
export const PAYLOAD_TYPE_OUTPUT = 1;
export const PAYLOAD_TYPE_HANDSHAKE_REQUEST = 5;
export const PAYLOAD_TYPE_HANDSHAKE_RESPONSE = 6;

export interface SSMMessage {
  messageType: string;
  sequenceNumber: bigint;
  messageId: string; // UUID string (8-4-4-4-12) — used in ACK JSON
  payloadType: number;
  payload: Buffer;
}

function bytesToUuid(bytes: Buffer): string {
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function rawDataToBuffer(data: WebSocket.RawData): Buffer {
  if (Buffer.isBuffer(data)) return data;
  if (typeof data === 'string') return Buffer.from(data, 'utf8');
  if (data instanceof ArrayBuffer) return Buffer.from(data);
  if (Array.isArray(data)) return Buffer.concat(data);
  return Buffer.from(data as any);
}

export function decodeSSMMessage(raw: Buffer): SSMMessage {
  if (raw.length < FRAME_HEADER_LENGTH) throw new Error(`SSM frame too short: ${raw.length}`);

  const headerLen = raw.readUInt32BE(0);
  if (headerLen !== HEADER_LENGTH) {
    throw new Error(`Unexpected SSM header length: ${headerLen}`);
  }

  const base = HEADER_PREFIX_LENGTH;

  const messageType = raw
    .subarray(base, base + 32)
    .toString('ascii')
    .replace(/\0/g, '')
    .trim();

  const seqHi = BigInt(raw.readUInt32BE(base + 44));
  const seqLo = BigInt(raw.readUInt32BE(base + 48));
  const sequenceNumber = (seqHi << 32n) | seqLo;

  const messageId = bytesToUuid(raw.subarray(base + 60, base + 76));

  const payloadType = raw.readUInt32BE(base + 108);
  const payloadLength = raw.readUInt32BE(base + 112);
  const payload = raw.subarray(FRAME_HEADER_LENGTH, FRAME_HEADER_LENGTH + payloadLength);

  return { messageType, sequenceNumber, messageId, payloadType, payload };
}

export function encodeSSMMessage(opts: {
  messageType: string;
  sequenceNumber: bigint;
  flags?: bigint;
  payloadType: number;
  payload: Buffer;
}): Buffer {
  const { messageType, sequenceNumber, flags = 0n, payloadType, payload } = opts;
  const digest = createHash('sha256').update(payload).digest();
  const buf = Buffer.alloc(FRAME_HEADER_LENGTH + payload.length, 0);

  buf.writeUInt32BE(HEADER_LENGTH, 0);
  const base = HEADER_PREFIX_LENGTH;

  Buffer.from(messageType, 'ascii').copy(buf, base, 0, Math.min(messageType.length, 32));
  buf.writeUInt32BE(1, base + 32);

  const now = BigInt(Date.now());
  buf.writeUInt32BE(Number(now >> 32n), base + 36);
  buf.writeUInt32BE(Number(now & 0xffff_ffffn), base + 40);

  buf.writeUInt32BE(Number(sequenceNumber >> 32n), base + 44);
  buf.writeUInt32BE(Number(sequenceNumber & 0xffff_ffffn), base + 48);

  buf.writeUInt32BE(Number(flags >> 32n), base + 52);
  buf.writeUInt32BE(Number(flags & 0xffff_ffffn), base + 56);

  Buffer.from(randomUUID().replace(/-/g, ''), 'hex').copy(buf, base + 60);
  digest.copy(buf, base + 76);

  buf.writeUInt32BE(payloadType, base + 108);
  buf.writeUInt32BE(payload.length, base + 112);

  payload.copy(buf, FRAME_HEADER_LENGTH);
  return buf;
}
