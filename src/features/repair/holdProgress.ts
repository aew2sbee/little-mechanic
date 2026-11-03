/** Something that works only while a finger holds it down: a screw, the pump, the oil can. */
export interface HoldProgress {
  readonly remainingMs: number;
  /** From 0 (not started) to 1 (done). */
  readonly progress: number;
  readonly isDone: boolean;
  /** Counts `ms` more of holding. Letting go keeps what was done, so stopping is never a setback. */
  hold(ms: number): HoldProgress;
}

export function createHoldProgress({ holdMs, heldMs = 0 }: { holdMs: number; heldMs?: number }): HoldProgress {
  const held = Math.min(heldMs, holdMs);
  return {
    remainingMs: holdMs - held,
    progress: held / holdMs,
    isDone: held === holdMs,
    hold: (ms) => createHoldProgress({ holdMs, heldMs: held + ms }),
  };
}
