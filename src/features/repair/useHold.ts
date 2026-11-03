import { useState, type PointerEvent } from 'react';
import { useTimeout } from '@/shared/ui';

interface Hold<Key> {
  key: Key;
  pointerId: number;
  startedAt: number;
}

/**
 * Times one finger held down on one of several things (`Key` tells them apart). There is one
 * tool in the hand, so a second finger is ignored until the first lets go.
 *
 * `onHeld` hears how long the finger stayed: when it lets go, or as soon as `remainingFor` runs
 * out while it is still down.
 */
export function useHold<Key>(remainingFor: (key: Key) => number, onHeld: (key: Key, ms: number) => void) {
  const [hold, setHold] = useState<Hold<Key>>();
  const remainingMs = hold ? remainingFor(hold.key) : 0;

  const end = (ms: number) => {
    if (!hold) return;
    setHold(undefined);
    onHeld(hold.key, Math.min(ms, remainingMs));
  };

  useTimeout(() => end(remainingMs), remainingMs, hold !== undefined);

  return {
    heldKey: hold?.key,
    /** Starts holding `key`. Returns false when something is already held or `key` is done. */
    press(key: Key, event: PointerEvent): boolean {
      if (hold || remainingFor(key) <= 0) return false;
      // Captured, so a finger that slides a little keeps holding.
      event.currentTarget.setPointerCapture?.(event.pointerId);
      setHold({ key, pointerId: event.pointerId, startedAt: Date.now() });
      return true;
    },
    release(event: PointerEvent) {
      if (hold?.pointerId === event.pointerId) end(Date.now() - hold.startedAt);
    },
  };
}
