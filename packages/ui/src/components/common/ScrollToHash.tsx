'use client';

import { useEffect } from 'react';

export const ScrollToHash = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let timeoutId: ReturnType<typeof window.setTimeout> | undefined;

    const scrollToHash = () => {
      const { hash } = window.location;

      if (hash) {
        const elementId = hash.replace('#', '');
        if (timeoutId != null) {
          window.clearTimeout(timeoutId);
        }
        timeoutId = window.setTimeout(() => {
          const element = document.getElementById(elementId);
          if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            });
          }
        }, 300);
      } else {
        window.scrollTo(0, 0);
      }
    };

    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);

    return () => {
      if (timeoutId != null) {
        window.clearTimeout(timeoutId);
      }
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, []);

  return null;
};
