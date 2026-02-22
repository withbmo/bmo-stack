import jwt from 'jsonwebtoken';

export type TerminalClaims = {
  typ: 'terminal_session';
  sub: string;
  envId: string;
  nonce: string;
  tabId?: string;
  instanceId: string;
  region: string;
  tmuxEnabled?: boolean;
  tmuxSessionName?: string;
  exp?: number;
};

export function verifyTerminalToken(token: string, secret: string): TerminalClaims {
  const decoded = jwt.verify(token, secret) as TerminalClaims;
  if (decoded.typ !== 'terminal_session') throw new Error('Invalid token type');
  if (!decoded.instanceId) throw new Error('Token missing instanceId');
  if (!decoded.region) throw new Error('Token missing region');
  return decoded;
}
