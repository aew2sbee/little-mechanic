/** Wiping every last speck is too much to ask of a small child, so seven tenths counts as clean. */
const CLEAN_THRESHOLD = 0.7;

export interface CleaningState {
  /** How much of the dirt is gone, from 0 to 1. */
  ratio: number;
  /** How close the job is to done, from 0 to 1. */
  progress: number;
  isComplete: boolean;
}

export function createCleaningProgress({ threshold = CLEAN_THRESHOLD }: { threshold?: number } = {}) {
  return {
    update(ratio: number): CleaningState {
      return { ratio, progress: Math.min(ratio / threshold, 1), isComplete: ratio >= threshold };
    },
  };
}
