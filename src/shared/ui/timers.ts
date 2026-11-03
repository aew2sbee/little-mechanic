import { useEffect, useEffectEvent } from 'react';

/** The timer functions logic depends on, so tests can hand in fake ones. */
export type Timers = Pick<typeof globalThis, 'setTimeout' | 'clearTimeout'>;

/**
 * Calls `callback` once, `delayMs` after `isActive` becomes true. Leaving the screen first
 * cancels it. The latest `callback` is used, so callers need not keep it stable.
 */
export function useTimeout(callback: () => void, delayMs: number, isActive = true) {
  const onTimeout = useEffectEvent(callback);

  useEffect(() => {
    if (!isActive) return;
    const timer = setTimeout(() => onTimeout(), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs, isActive]);
}

/** Calls `callback` every `intervalMs` for as long as `isActive` stays true. */
export function useInterval(callback: () => void, intervalMs: number, isActive = true) {
  const onTick = useEffectEvent(callback);

  useEffect(() => {
    if (!isActive) return;
    const timer = setInterval(() => onTick(), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs, isActive]);
}
