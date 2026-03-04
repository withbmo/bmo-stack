import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  ENV_SESSION_TTL_SECONDS_DEFAULT,
  ORCHESTRATOR_CIRCUIT_FAILURE_THRESHOLD_DEFAULT,
  ORCHESTRATOR_CIRCUIT_OPEN_MS_DEFAULT,
  ORCHESTRATOR_TIMEOUT_MS_DEFAULT,
  ORCHESTRATOR_URL_DEFAULT,
  TERMINAL_GATEWAY_WS_URL_DEFAULT,
} from '../config/defaults';

/**
 * Centralized environments configuration. Single source of truth for orchestrator,
 * session, and terminal env vars used by the environments module.
 */
@Injectable()
export class EnvironmentsConfigService {
  readonly orchestratorUrl: string;
  readonly internalSecret: string;
  readonly orchestratorTimeoutMs: number;
  readonly circuitFailureThreshold: number;
  readonly circuitOpenDurationMs: number;
  readonly sessionSecret: string;
  readonly sessionTtlSeconds: number;
  readonly terminalWsBaseUrl: string;
  readonly externalApiKeyModeEnabled: boolean;

  constructor(configService: ConfigService) {
    const orchestratorUrlRaw = configService.get<string>('ORCHESTRATOR_URL')?.trim();
    this.orchestratorUrl = orchestratorUrlRaw || ORCHESTRATOR_URL_DEFAULT;

    this.internalSecret = configService.get<string>('INTERNAL_SECRET')?.trim() ?? '';

    const timeoutMs = configService.get<number>('ORCHESTRATOR_TIMEOUT_MS');
    this.orchestratorTimeoutMs =
      typeof timeoutMs === 'number' && Number.isFinite(timeoutMs) && timeoutMs > 0
        ? timeoutMs
        : ORCHESTRATOR_TIMEOUT_MS_DEFAULT;

    const failureThreshold = configService.get<number>('ORCHESTRATOR_CIRCUIT_FAILURE_THRESHOLD');
    this.circuitFailureThreshold =
      typeof failureThreshold === 'number' &&
      Number.isFinite(failureThreshold) &&
      failureThreshold > 0
        ? failureThreshold
        : ORCHESTRATOR_CIRCUIT_FAILURE_THRESHOLD_DEFAULT;

    const openMs = configService.get<number>('ORCHESTRATOR_CIRCUIT_OPEN_MS');
    this.circuitOpenDurationMs =
      typeof openMs === 'number' && Number.isFinite(openMs) && openMs > 0
        ? openMs
        : ORCHESTRATOR_CIRCUIT_OPEN_MS_DEFAULT;

    const sessionSecretRaw =
      configService.get<string>('ENV_SESSION_SECRET')?.trim() ||
      configService.get<string>('JWT_SECRET')?.trim();
    this.sessionSecret = sessionSecretRaw ?? '';

    const sessionTtl = configService.get<number>('ENV_SESSION_TTL_SECONDS');
    this.sessionTtlSeconds =
      typeof sessionTtl === 'number' && Number.isFinite(sessionTtl) && sessionTtl > 0
        ? sessionTtl
        : ENV_SESSION_TTL_SECONDS_DEFAULT;

    const terminalWsRaw = configService.get<string>('TERMINAL_GATEWAY_WS_URL')?.trim();
    this.terminalWsBaseUrl = terminalWsRaw || TERMINAL_GATEWAY_WS_URL_DEFAULT;

    const externalApiKeyModeEnabledRaw = configService.get<boolean | string>(
      'ENABLE_EXTERNAL_PROD_API_KEY_MODE',
    );
    this.externalApiKeyModeEnabled =
      typeof externalApiKeyModeEnabledRaw === 'boolean'
        ? externalApiKeyModeEnabledRaw
        : String(externalApiKeyModeEnabledRaw ?? '')
            .trim()
            .toLowerCase() === 'true';
  }
}
