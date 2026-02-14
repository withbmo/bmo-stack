import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface TurnstileVerifyRequest {
  secret: string;
  response: string;
  remoteip?: string;
}

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

@Injectable()
export class TurnstileService {
  private readonly logger = new Logger(TurnstileService.name);
  private readonly secretKey: string;
  private readonly verifyUrl =
    'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  private readonly isDevelopment: boolean;

  constructor(private readonly configService: ConfigService) {
    this.secretKey =
      this.configService.get<string>('TURNSTILE_SECRET_KEY') || '';
    this.isDevelopment =
      this.configService.get<string>('NODE_ENV') === 'development';

    if (!this.secretKey && !this.isDevelopment) {
      this.logger.warn(
        'Turnstile secret key not configured. Captcha verification will fail in production.',
      );
    }
  }

  /**
   * Verify Cloudflare Turnstile token
   * @param token The Turnstile response token from the client
   * @param remoteIp Optional IP address of the user
   * @returns true if verification succeeds, false otherwise
   */
  async verifyToken(token: string, remoteIp?: string): Promise<boolean> {
    // Skip verification in development mode
    if (this.isDevelopment) {
      this.logger.log('[DEV MODE] Skipping Turnstile verification');
      return true;
    }

    if (!this.secretKey) {
      this.logger.error('Turnstile secret key not configured');
      return false;
    }

    if (!token) {
      this.logger.warn('No Turnstile token provided');
      return false;
    }

    try {
      const payload: TurnstileVerifyRequest = {
        secret: this.secretKey,
        response: token,
      };

      if (remoteIp) {
        payload.remoteip = remoteIp;
      }

      const response = await fetch(this.verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        this.logger.error(
          `Turnstile API returned error: ${response.status} ${response.statusText}`,
        );
        return false;
      }

      const data = (await response.json()) as TurnstileVerifyResponse;

      if (!data.success) {
        this.logger.warn('Turnstile verification failed', {
          errorCodes: data['error-codes'],
        });
        return false;
      }

      this.logger.log('Turnstile verification successful', {
        hostname: data.hostname,
        timestamp: data.challenge_ts,
      });

      return true;
    } catch (error) {
      this.logger.error(
        'Error verifying Turnstile token',
        error instanceof Error ? error.stack : error,
      );
      return false;
    }
  }

  /**
   * Check if Turnstile is properly configured
   */
  isConfigured(): boolean {
    return !!this.secretKey;
  }

  /**
   * Check if we're in development mode
   */
  isDevelopmentMode(): boolean {
    return this.isDevelopment;
  }
}
