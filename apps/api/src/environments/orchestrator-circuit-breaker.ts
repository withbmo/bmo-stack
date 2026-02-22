export class CircuitOpenError extends Error {
  constructor(message = 'Circuit breaker is open') {
    super(message);
    this.name = 'CircuitOpenError';
  }
}

type CircuitState = 'closed' | 'open' | 'half_open';

export class SimpleCircuitBreaker {
  private state: CircuitState = 'closed';
  private consecutiveFailures = 0;
  private openedUntilMs = 0;

  constructor(
    private readonly opts: {
      failureThreshold: number;
      openDurationMs: number;
    }
  ) {}

  async exec<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();

    if (this.state === 'open') {
      if (now < this.openedUntilMs) {
        throw new CircuitOpenError(
          `Orchestrator circuit open until ${new Date(this.openedUntilMs).toISOString()}`
        );
      }
      this.state = 'half_open';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }

  private onSuccess(): void {
    this.consecutiveFailures = 0;
    this.state = 'closed';
    this.openedUntilMs = 0;
  }

  private onFailure(): void {
    this.consecutiveFailures += 1;
    if (this.consecutiveFailures >= this.opts.failureThreshold || this.state === 'half_open') {
      this.state = 'open';
      this.openedUntilMs = Date.now() + this.opts.openDurationMs;
    }
  }
}

