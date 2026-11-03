import type { Timers } from '@/shared/hint';

/** Long enough that a small child will not hold it by accident. */
export const LONG_PRESS_MS = 3000;

interface LongPressOptions {
  durationMs?: number;
  timers?: Timers;
  onLongPress: () => void;
}

export function createLongPress({ durationMs = LONG_PRESS_MS, timers = globalThis, onLongPress }: LongPressOptions) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return {
    press() {
      timer ??= timers.setTimeout(() => {
        timer = undefined;
        onLongPress();
      }, durationMs);
    },
    release() {
      if (timer !== undefined) timers.clearTimeout(timer);
      timer = undefined;
    },
  };
}
