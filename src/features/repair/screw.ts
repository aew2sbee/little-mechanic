export type ScrewAction = 'remove' | 'tighten';

/** How many touches every screw takes: enough to feel like work, few enough to stay fun. */
export const TOUCHES_PER_SCREW = 3;

export interface Screw {
  readonly touches: number;
  readonly isDone: boolean;
  /** How far the screw stands out of its hole, from 0 (all the way in) to 1 (all the way out). */
  readonly lift: number;
  touch(): Screw;
}

export function createScrew({
  action,
  touchesNeeded = TOUCHES_PER_SCREW,
  touches = 0,
}: {
  action: ScrewAction;
  touchesNeeded?: number;
  touches?: number;
}): Screw {
  const done = touches / touchesNeeded;
  return {
    touches,
    isDone: touches >= touchesNeeded,
    lift: action === 'remove' ? done : 1 - done,
    touch: () => createScrew({ action, touchesNeeded, touches: Math.min(touches + 1, touchesNeeded) }),
  };
}
