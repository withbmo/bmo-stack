import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { setOauthNextCookie, setOauthStateCookie } from '../../auth/auth.cookies';
import { OauthStateService } from '../oauth-state.service';

function sanitizeNext(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const next = value.trim();
  if (!next) return null;
  if (!next.startsWith('/')) return null;
  if (next.startsWith('//')) return null;
  if (next.includes('://')) return null;
  return next;
}

@Injectable()
export class GithubOauthStateGuard extends AuthGuard('github') {
  constructor(private readonly oauthStateService: OauthStateService) {
    super();
  }

  public async getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const state = await this.oauthStateService.createState();
    setOauthStateCookie(res, state);

    const next = sanitizeNext(req?.query?.next);
    if (next) setOauthNextCookie(res, next);

    return { state, session: false };
  }
}
