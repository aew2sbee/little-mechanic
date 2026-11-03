import type { Timers } from '@/shared/ui';

/** Long enough that a small child will not hold it by accident. */
export const LONG_PRESS_MS = 3000;

interface LongPressOptions {
  timers?: Timers;
  onLongPress: () => void;
}

export function createLongPress({ timers = globalThis, onLongPress }: LongPressOptions) {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return {
    press() {
      timer ??= timers.setTimeout(() => {
        timer = undefined;
        onLongPress();
      }, LONG_PRESS_MS);
    },
    release() {
      if (timer !== undefined) timers.clearTimeout(timer);
      timer = undefined;
    },
  };
}
