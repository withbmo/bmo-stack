import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { OauthStateService } from '../oauth-state.service';

@Injectable()
export class GoogleOauthStateGuard extends AuthGuard('google') {
  constructor(private readonly oauthStateService: OauthStateService) {
    super();
  }

  public async getAuthenticateOptions(_context: ExecutionContext) {
    const state = await this.oauthStateService.createState();
    return { state, session: false };
  }
}
