import { useCallback,useEffect, useState } from 'react';

import { getEnvironmentStatus } from '../lib/environments';

export interface EnvironmentStatus {
  environmentId: string;
  status: string;
  state?: string;
  instanceId?: string;
  privateIp?: string;
  ipv6Addresses?: string[];
  region?: string;
  lastUpdated: string;
}

interface UseEnvironmentStatusOptions {
  /** Polling interval in milliseconds. Default: 10000 (10 seconds) */
  pollInterval?: number;
  /** Whether to start polling immediately. Default: true */
  enabled?: boolean;
  /** Stop polling when status reaches these values */
  stopOnStatus?: string[];
}

/**
 * Hook to automatically poll environment status from the orchestrator.
 *
 * Usage:
 * ```tsx
 * const { status, loading, error, refetch } = useEnvironmentStatus(envId, {
 *   pollInterval: 5000, // Poll every 5 seconds
 *   stopOnStatus: ['running', 'stopped', 'terminated'], // Stop polling when reached
 * });
 * ```
 */
export function useEnvironmentStatus(
  environmentId: string | null,
  options: UseEnvironmentStatusOptions = {}
) {
  const {
    pollInterval = 10000,
    enabled = true,
    stopOnStatus = [],
  } = options;

  const [status, setStatus] = useState<EnvironmentStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!environmentId || !enabled) return;

    setLoading(true);
    setError(null);

    try {
      const result = await getEnvironmentStatus(undefined, environmentId);
      setStatus(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch status'));
      return null;
    } finally {
      setLoading(false);
    }
  }, [environmentId, enabled]);

  useEffect(() => {
    if (!environmentId || !enabled) return;

    // Fetch immediately on mount
    fetchStatus();

    // Set up polling interval
    const interval = setInterval(async () => {
      const result = await fetchStatus();

      // Stop polling if status reached terminal state
      if (result && stopOnStatus.length > 0) {
        if (stopOnStatus.includes(result.status) || stopOnStatus.includes(result.state || '')) {
          clearInterval(interval);
        }
      }
    }, pollInterval);

    return () => clearInterval(interval);
  }, [environmentId, enabled, pollInterval, stopOnStatus, fetchStatus]);

  return {
    status,
    loading,
    error,
    refetch: fetchStatus,
  };
}
