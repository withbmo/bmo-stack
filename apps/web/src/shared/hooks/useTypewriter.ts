import { useState, useEffect, useCallback } from 'react';
import { TYPEWRITER } from '../constants';

interface UseTypewriterOptions {
  /** Text to type out */
  text: string;
  /** Typing speed in milliseconds per character */
  speed?: number;
  /** Whether the animation is enabled */
  enabled?: boolean;
  /** Callback when typing completes */
  onComplete?: () => void;
}

interface UseTypewriterReturn {
  /** Current displayed text */
  displayedText: string;
  /** Whether typing is in progress */
  isTyping: boolean;
  /** Reset and restart the animation */
  reset: () => void;
}

/**
 * Hook for typewriter-style text animation
 */
export function useTypewriter({
  text,
  speed = TYPEWRITER.DEFAULT_SPEED,
  enabled = true,
  onComplete,
}: UseTypewriterOptions): UseTypewriterReturn {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const reset = useCallback(() => {
    setDisplayedText('');
    setIsTyping(false);
  }, []);

  useEffect(() => {
    if (!enabled) {
      reset();
      return;
    }

    setIsTyping(true);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, enabled, onComplete, reset]);

  return { displayedText, isTyping, reset };
}
