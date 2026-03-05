'use client';

import { useEffect } from 'react';

export function HydrationErrorSuppressor() {
  useEffect(() => {
    // Suppress hydration errors caused by browser extensions
    const originalError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('Hydration failed because the initial UI') &&
        args[0].includes('does not match what was rendered on the server')
      ) {
        return; // Suppress hydration mismatch errors from browser extensions
      }
      originalError.call(console, ...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return null;
}
