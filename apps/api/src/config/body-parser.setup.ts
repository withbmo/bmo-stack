import { INestApplication } from '@nestjs/common';
import { json, NextFunction, raw, Request, Response, urlencoded } from 'express';

/**
 * Configures body parsers for the application.
 * - better-auth handles its own body parsing.
 * - All other routes default to JSON and URL-encoded parsers.
 */
export function setupBodyParsers(app: INestApplication, globalPrefix: string) {
  const betterAuthRootPath = `/${globalPrefix}/auth`;
  const stripeWebhookRootPath = `/${globalPrefix}/billing/webhook`;

  const jsonParser = json();
  const urlencodedParser = urlencoded({ extended: true });
  const rawJsonParser = raw({ type: 'application/json' });

  const stripQuery = (url?: string) => {
    if (!url) return '';
    const idx = url.indexOf('?');
    return idx >= 0 ? url.slice(0, idx) : url;
  };

  const shouldBypassParser = (url?: string) => {
    if (!url) return false;
    const path = stripQuery(url);
    return path === betterAuthRootPath || path.startsWith(`${betterAuthRootPath}/`);
  };

  const shouldUseRawJson = (url?: string) => {
    if (!url) return false;
    const path = stripQuery(url);
    return path === stripeWebhookRootPath || path.startsWith(`${stripeWebhookRootPath}/`);
  };

  // Stripe webhook: requires raw body for signature verification.
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (shouldUseRawJson(req.originalUrl)) return rawJsonParser(req, res, next);
    return next();
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (shouldBypassParser(req.originalUrl) || shouldUseRawJson(req.originalUrl)) return next();
    return jsonParser(req, res, next);
  });
  
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (shouldBypassParser(req.originalUrl) || shouldUseRawJson(req.originalUrl)) return next();
    return urlencodedParser(req, res, next);
  });
}
