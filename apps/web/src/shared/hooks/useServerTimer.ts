import { useEffect, useState } from 'react';

interface UseServerTimerReturn {
  secondsLeft: number;
  isActive: boolean;
}

/**
 * Countdown based on a server-provided ISO timestamp.
 * Calculates remaining time as target - Date.now() to avoid drift.
 */
export function useServerTimer(targetIso?: string | null): UseServerTimerReturn {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!targetIso) {
      setSecondsLeft(0);
      return;
    }

    const targetMs = Date.parse(targetIso);
    if (Number.isNaN(targetMs)) {
      setSecondsLeft(0);
      return;
    }

    const update = () => {
      const diffMs = targetMs - Date.now();
      const next = Math.max(0, Math.ceil(diffMs / 1000));
      setSecondsLeft(next);
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  return { secondsLeft, isActive: secondsLeft > 0 };
}
