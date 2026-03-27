'use client';

import { useEffect } from 'react';

export function HydrationErrorSuppressor() {
  useEffect(() => {
    // Suppress hydration errors caused by browser extensions
    const originalError = console.error;
    const originalWarn = console.warn;
    
    console.error = (...args) => {
      const errorMessage = args[0]?.toString() || '';
      
      // Suppress various hydration mismatch errors from browser extensions
      if (
        errorMessage.includes('Hydration failed because the initial UI') ||
        errorMessage.includes('does not match what was rendered on the server') ||
        errorMessage.includes('A tree hydrated but some attributes of the server rendered HTML didn\'t match the client properties') ||
        errorMessage.includes('rp-extension') ||
        errorMessage.includes('hydration-mismatch') ||
        errorMessage.includes('installHook.js') ||
        errorMessage.includes('overrideMethod') ||
        errorMessage.includes('react-devtools') ||
        errorMessage.includes('chrome-extension') ||
        errorMessage.includes('browser-extension')
      ) {
        return; // Suppress hydration mismatch errors from browser extensions
      }
      originalError.call(console, ...args);
    };

    console.warn = (...args) => {
      const warnMessage = args[0]?.toString() || '';
      
      // Suppress hydration warnings
      if (
        warnMessage.includes('Hydration failed because the initial UI') ||
        warnMessage.includes('does not match what was rendered on the server') ||
        warnMessage.includes('A tree hydrated but some attributes of the server rendered HTML didn\'t match the client properties') ||
        warnMessage.includes('rp-extension') ||
        warnMessage.includes('hydration-mismatch') ||
        warnMessage.includes('installHook.js') ||
        warnMessage.includes('overrideMethod') ||
        warnMessage.includes('react-devtools') ||
        warnMessage.includes('chrome-extension') ||
        warnMessage.includes('browser-extension')
      ) {
        return; // Suppress hydration mismatch warnings from browser extensions
      }
      originalWarn.call(console, ...args);
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  return null;
}
