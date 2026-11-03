import { useState, type CSSProperties, type PointerEvent } from 'react';
import { useSound, type SoundName } from '@/shared/sound';
import { useInterval, useTimeout } from '@/shared/ui';
import { createHoldProgress, type HoldProgress } from './holdProgress';

interface Hold {
  index: number;
  pointerId: number;
  startedAt: number;
}

interface HoldProgressOptions {
  /** How many things there are to hold: the screws of a part, or the one pump or oil can. */
  count: number;
  holdMs: number;
  /** Played as the finger goes down, then every `soundGapMs` while it stays. */
  workSound: SoundName;
  soundGapMs: number;
  /** Played as each one is done. */
  doneSound?: SoundName;
  /** Called when one of them is done, with all of them as they now are. */
  onDone?: (all: readonly HoldProgress[]) => void;
}

/**
 * Things that work only while a finger holds them down. There is one tool in the hand, so one
 * is held at a time and a second finger is ignored until the first lets go.
 */
export function useHoldProgress({ count, holdMs, workSound, soundGapMs, doneSound, onDone }: HoldProgressOptions) {
  const sound = useSound();
  const [items, setItems] = useState(() => Array.from({ length: count }, () => createHoldProgress({ holdMs })));
  const [hold, setHold] = useState<Hold>();
  const remainingMs = hold ? items[hold.index].remainingMs : 0;

  /** Counts the time the finger stayed: when it lets go, or as soon as the time is up. */
  const end = (ms: number) => {
    if (!hold) return;
    const held = items[hold.index].hold(ms);
    const next = items.map((item, index) => (index === hold.index ? held : item));
    setHold(undefined);
    setItems(next);
    if (!held.isDone) return;
    if (doneSound) sound.play(doneSound);
    onDone?.(next);
  };

  useTimeout(() => end(remainingMs), remainingMs, hold !== undefined);
  useInterval(() => sound.play(workSound), soundGapMs, hold !== undefined);

  const release = (event: PointerEvent) => {
    if (hold?.pointerId === event.pointerId) end(Date.now() - hold.startedAt);
  };

  return {
    items,
    heldIndex: hold?.index,
    /** Pointer handlers for the thing at `index`. */
    handlersFor: (index: number) => ({
      onPointerDown: (event: PointerEvent) => {
        if (hold || items[index].isDone) return;
        // Captured, so a finger that slides a little keeps holding.
        event.currentTarget.setPointerCapture?.(event.pointerId);
        setHold({ index, pointerId: event.pointerId, startedAt: Date.now() });
        sound.play(workSound);
      },
      onPointerUp: release,
      onPointerCancel: release,
    }),
    /**
     * For the element whose CSS animations show the thing at `index` working (see repair.css).
     * They last `holdMs` and run only while it is held, so the picture keeps pace with the logic.
     */
    styleFor: (index: number) =>
      ({ '--hold-ms': `${holdMs}ms`, '--hold-play': hold?.index === index ? 'running' : 'paused' }) as CSSProperties,
  };
}
