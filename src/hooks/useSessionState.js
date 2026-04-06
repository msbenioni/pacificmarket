import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * General-purpose session state persistence hook.
 * Persists UI state to localStorage keyed by userId + namespace.
 * 
 * Features:
 * - Debounced writes (300ms default)
 * - Keyed by user ID to prevent cross-user contamination
 * - Automatic expiry for stale state (default 7 days)
 * - Hydrates before first render to prevent flicker
 * - Supports partial updates via returned setter
 * 
 * Usage:
 *   const [state, setState, clearState] = useSessionState('welcome-story-generator', defaultState, userId);
 */

const STORAGE_PREFIX = 'pdn-session';
const DEFAULT_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function buildKey(namespace, userId) {
  const userPart = userId || 'anonymous';
  return `${STORAGE_PREFIX}:${userPart}:${namespace}`;
}

function readFromStorage(key) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const envelope = JSON.parse(raw);
    // Check expiry
    if (envelope.expiresAt && Date.now() > envelope.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    return envelope.data;
  } catch {
    return null;
  }
}

function writeToStorage(key, data, expiryMs = DEFAULT_EXPIRY_MS) {
  if (typeof window === 'undefined') return;
  try {
    const envelope = {
      data,
      savedAt: Date.now(),
      expiresAt: Date.now() + expiryMs,
    };
    localStorage.setItem(key, JSON.stringify(envelope));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

function removeFromStorage(key) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/**
 * @param {string} namespace - Feature namespace e.g. 'welcome-story-generator'
 * @param {object} defaultState - Default state shape
 * @param {string|null} userId - Authenticated user ID (null = anonymous)
 * @param {object} [options]
 * @param {number} [options.debounceMs=300] - Debounce interval for writes
 * @param {number} [options.expiryMs=604800000] - State expiry in ms (default 7 days)
 * @param {string[]} [options.exclude] - Keys to exclude from persistence (e.g. transient UI state)
 * @returns {[object, function, function]} [state, setState, clearState]
 */
export function useSessionState(namespace, defaultState, userId, options = {}) {
  const {
    debounceMs = 300,
    expiryMs = DEFAULT_EXPIRY_MS,
    exclude = [],
  } = options;

  const storageKey = buildKey(namespace, userId);
  const debounceRef = useRef(null);
  const initializedRef = useRef(false);

  // Hydrate from storage on first render (synchronous to prevent flicker)
  const [state, setStateRaw] = useState(() => {
    const stored = readFromStorage(storageKey);
    if (stored) {
      // Merge stored with defaults so new keys in defaultState get their defaults
      return { ...defaultState, ...stored };
    }
    return defaultState;
  });

  // Track the storage key — if user changes, re-hydrate
  const prevKeyRef = useRef(storageKey);
  useEffect(() => {
    if (prevKeyRef.current !== storageKey) {
      prevKeyRef.current = storageKey;
      const stored = readFromStorage(storageKey);
      if (stored) {
        setStateRaw({ ...defaultState, ...stored });
      } else {
        setStateRaw(defaultState);
      }
    }
  }, [storageKey]);

  // Debounced write to localStorage on state changes
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      // Filter out excluded keys before persisting
      let dataToSave = state;
      if (exclude.length > 0) {
        dataToSave = { ...state };
        for (const key of exclude) {
          delete dataToSave[key];
        }
      }
      writeToStorage(storageKey, dataToSave, expiryMs);
    }, debounceMs);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [state, storageKey, debounceMs, expiryMs]);

  // Setter supports both full replacement and partial updates (like React setState)
  const setState = useCallback((updater) => {
    setStateRaw((prev) => {
      if (typeof updater === 'function') {
        return updater(prev);
      }
      // Partial merge for plain objects
      if (updater && typeof updater === 'object' && !Array.isArray(updater)) {
        return { ...prev, ...updater };
      }
      return updater;
    });
  }, []);

  // Clear persisted state and reset to defaults
  const clearState = useCallback(() => {
    removeFromStorage(storageKey);
    setStateRaw(defaultState);
  }, [storageKey, defaultState]);

  return [state, setState, clearState];
}

/**
 * Clean up all expired session states.
 * Call this once on app startup or login.
 */
export function cleanupExpiredSessions() {
  if (typeof window === 'undefined') return;
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        try {
          const raw = localStorage.getItem(key);
          if (raw) {
            const envelope = JSON.parse(raw);
            if (envelope.expiresAt && Date.now() > envelope.expiresAt) {
              keysToRemove.push(key);
            }
          }
        } catch {
          // Corrupted entry — remove it
          keysToRemove.push(key);
        }
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch {
    // ignore
  }
}
