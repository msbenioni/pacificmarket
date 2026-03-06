'use client';

import { useEffect } from 'react';

export function HydrationErrorSuppressor() {
  useEffect(() => {
    // Suppress hydration errors caused by browser extensions
    const originalError = console.error;
    console.error = (...args) => {
      const errorMessage = args[0]?.toString() || '';
      
      // Suppress various hydration mismatch errors from browser extensions
      if (
        errorMessage.includes('Hydration failed because the initial UI') ||
        errorMessage.includes('does not match what was rendered on the server') ||
        errorMessage.includes('A tree hydrated but some attributes of the server rendered HTML didn\'t match the client properties') ||
        errorMessage.includes('rp-extension')
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
