import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GithubOauthCallbackGuard extends AuthGuard('github') {
  // Allow controller to handle errors/redirects instead of throwing inside the guard.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    if (err) req.oauthError = err;
    if (!user && info) req.oauthError = info;
    return user;
  }
}

