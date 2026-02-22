import { INestApplication } from '@nestjs/common';
import { json, NextFunction, raw, Request, Response, urlencoded } from 'express';

/**
 * Configures body parsers for the application.
 * - Stripe webhook requires the raw request body for signature verification.
 * - better-auth handles its own body parsing.
 * - All other routes default to JSON and URL-encoded parsers.
 */
export function setupBodyParsers(app: INestApplication, globalPrefix: string) {
  const stripeWebhookPath = `/${globalPrefix}/billing/webhook`;
  const betterAuthRootPath = `/${globalPrefix}/auth`;
  
  const jsonParser = json();
  const urlencodedParser = urlencoded({ extended: true });

  const shouldBypassParser = (url?: string) => {
    if (!url) return false;
    if (url.startsWith(stripeWebhookPath)) return true;
    return url === betterAuthRootPath || url.startsWith(`${betterAuthRootPath}/`);
  };

  app.use(stripeWebhookPath, raw({ type: 'application/json' }));
  
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (shouldBypassParser(req.originalUrl)) return next();
    return jsonParser(req, res, next);
  });
  
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (shouldBypassParser(req.originalUrl)) return next();
    return urlencodedParser(req, res, next);
  });
}
