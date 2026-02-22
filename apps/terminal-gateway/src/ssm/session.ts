import { SSMClient, StartSessionCommand, TerminateSessionCommand } from '@aws-sdk/client-ssm';
import { randomUUID } from 'crypto';
import WebSocket from 'ws';

import {
  decodeSSMMessage,
  encodeSSMMessage,
  PAYLOAD_TYPE_ACK,
  PAYLOAD_TYPE_HANDSHAKE_REQUEST,
  PAYLOAD_TYPE_HANDSHAKE_RESPONSE,
  PAYLOAD_TYPE_OUTPUT,
  rawDataToBuffer,
} from './codec';

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isTargetNotConnectedError(err: unknown): boolean {
  const e = err as { name?: unknown; message?: unknown };
  const name = typeof e?.name === 'string' ? e.name : '';
  const message = typeof e?.message === 'string' ? e.message : '';
  return (
    name.toLowerCase().includes('targetnotconnected') ||
    message.toLowerCase().includes('is not connected')
  );
}

export function encodeAck(ackedType: string, ackedMessageId: string, ackedSeq: bigint): Buffer {
  const payload = Buffer.from(
    JSON.stringify({
      AcknowledgedMessageType: ackedType,
      AcknowledgedMessageId: ackedMessageId,
      AcknowledgedMessageSequenceNumber: Number(ackedSeq),
      IsSequentialMessage: true,
    }),
    'utf8'
  );
  return encodeSSMMessage({
    messageType: 'acknowledge',
    sequenceNumber: 0n,
    flags: 3n,
    payloadType: PAYLOAD_TYPE_ACK,
    payload,
  });
}

export function encodeHandshakeResponse(ourSeq: bigint): Buffer {
  const payload = Buffer.from(
    JSON.stringify({
      ClientVersion: '1.0.0.0',
      ProcessedClientActions: [
        {
          ActionType: 'SessionType',
          ActionStatus: 'Success',
          ActionResult: { SessionType: 'InteractiveCommands' },
        },
      ],
      Errors: [],
    }),
    'utf8'
  );
  return encodeSSMMessage({
    messageType: 'input_stream_data',
    sequenceNumber: ourSeq,
    payloadType: PAYLOAD_TYPE_HANDSHAKE_RESPONSE,
    payload,
  });
}

export function encodeInput(text: string, ourSeq: bigint): Buffer {
  return encodeSSMMessage({
    messageType: 'input_stream_data',
    sequenceNumber: ourSeq,
    payloadType: PAYLOAD_TYPE_OUTPUT,
    payload: Buffer.from(text, 'utf8'),
  });
}

export async function startSsmShellSession(opts: {
  instanceId: string;
  region: string;
  command: string;
  onEstablished: () => void;
  onOutput: (chunk: string) => void;
  onClosedByRemote: () => void;
  onError: (message: string) => void;
}): Promise<{
  ssmWs: WebSocket;
  sendInput: (data: string) => void;
  terminate: () => Promise<void>;
}> {
  const { instanceId, region, command, onEstablished, onOutput, onClosedByRemote, onError } = opts;

  const ssm = new SSMClient({ region });
  const maxAttempts = 30;
  const baseDelayMs = 2000;

  let res:
    | Awaited<ReturnType<SSMClient['send']>>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | any;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      res = await ssm.send(
        new StartSessionCommand({
          Target: instanceId,
          DocumentName: 'AWS-StartInteractiveCommand',
          Parameters: { command: [command] },
        })
      );
      break;
    } catch (err) {
      if (!isTargetNotConnectedError(err) || attempt === maxAttempts - 1) throw err;
      const jitter = Math.floor(Math.random() * 250);
      await sleep(baseDelayMs + jitter);
    }
  }

  const sessionId = res.SessionId;
  const streamUrl = res.StreamUrl;
  const tokenValue = res.TokenValue;

  if (!streamUrl || !tokenValue || !sessionId) {
    throw new Error('Incomplete SSM session response');
  }

  const ssmWs = new WebSocket(streamUrl);
  let ourSeq = 0n;
  let established = false;

  const seenOutputMessageIds = new Set<string>();
  const seenOutputQueue: string[] = [];
  const SEEN_OUTPUT_MAX = 512;

  const markEstablished = () => {
    if (established) return;
    established = true;
    onEstablished();
  };

  ssmWs.once('open', () => {
    ssmWs.send(
      JSON.stringify({
        MessageSchemaVersion: '1.0',
        RequestId: randomUUID(),
        TokenValue: tokenValue,
        ClientId: randomUUID(),
        ClientVersion: '1.0.0.0',
      })
    );
  });

  ssmWs.on('message', (data: WebSocket.RawData, isBinary: boolean) => {
    if (!isBinary) return;
    const raw = rawDataToBuffer(data);

    let msg;
    try {
      msg = decodeSSMMessage(raw);
    } catch {
      return;
    }

    switch (msg.messageType) {
      case 'output_stream_data': {
        markEstablished();
        if (seenOutputMessageIds.has(msg.messageId)) {
          ssmWs.send(encodeAck(msg.messageType, msg.messageId, msg.sequenceNumber));
          break;
        }
        seenOutputMessageIds.add(msg.messageId);
        seenOutputQueue.push(msg.messageId);
        if (seenOutputQueue.length > SEEN_OUTPUT_MAX) {
          const evict = seenOutputQueue.shift();
          if (evict) seenOutputMessageIds.delete(evict);
        }

        onOutput(msg.payload.toString('utf8'));
        ssmWs.send(encodeAck(msg.messageType, msg.messageId, msg.sequenceNumber));
        break;
      }
      case 'start_publication': {
        markEstablished();
        if (msg.payloadType === PAYLOAD_TYPE_HANDSHAKE_REQUEST) {
          ssmWs.send(encodeHandshakeResponse(ourSeq++));
        }
        break;
      }
      case 'channel_closed': {
        onClosedByRemote();
        ssmWs.close();
        break;
      }
      default:
        break;
    }
  });

  ssmWs.on('error', () => {
    onError('SSM WebSocket error');
  });

  ssmWs.on('close', (code: number, reason: Buffer) => {
    if (!established) {
      const reasonText = reason?.toString('utf8')?.trim();
      onError(
        `SSM session closed before establishment (code ${code}${reasonText ? `: ${reasonText}` : ''})`
      );
    }
  });

  return {
    ssmWs,
    sendInput: (data: string) => {
      if (ssmWs.readyState !== WebSocket.OPEN) {
        onError('Terminal not connected');
        return;
      }
      ssmWs.send(encodeInput(data, ourSeq++));
    },
    terminate: async () => {
      await ssm.send(new TerminateSessionCommand({ SessionId: sessionId }));
    },
  };
}
