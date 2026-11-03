export type Timers = Pick<typeof globalThis, 'setTimeout' | 'clearTimeout'>;

export const HINT_DELAY_MS = 5000;

interface IdleHintOptions {
  delayMs?: number;
  timers?: Timers;
  onChange: (isVisible: boolean) => void;
}

export interface IdleHint {
  /** Starts watching for inactivity. */
  start(): void;
  /** Tells the hint the child did something: it hides and the wait starts over. */
  touch(): void;
  stop(): void;
}

export function createIdleHint({ delayMs = HINT_DELAY_MS, timers = globalThis, onChange }: IdleHintOptions): IdleHint {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let isVisible = false;

  const setVisible = (value: boolean) => {
    if (value === isVisible) return;
    isVisible = value;
    onChange(value);
  };

  const restart = () => {
    if (timer !== undefined) timers.clearTimeout(timer);
    timer = timers.setTimeout(() => setVisible(true), delayMs);
  };

  return {
    start: restart,
    touch() {
      setVisible(false);
      restart();
    },
    stop() {
      if (timer !== undefined) timers.clearTimeout(timer);
      timer = undefined;
    },
  };
}
