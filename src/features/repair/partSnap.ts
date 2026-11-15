import type { Point } from '@/shared/ui';

interface PartSnapOptions {
  /** Where the part belongs. */
  slot: Point;
  /** Where the part waits, and returns to when dropped elsewhere. */
  home: Point;
  /** How close to `slot` a drop has to land. Small fingers are not precise, so keep it generous. */
  radius: number;
}

export interface SnapResult {
  isSnapped: boolean;
  position: Point;
}

export function createPartSnap({ slot, home, radius }: PartSnapOptions) {
  return {
    drop(point: Point): SnapResult {
      const isSnapped = Math.hypot(point.x - slot.x, point.y - slot.y) <= radius;
      return { isSnapped, position: isSnapped ? slot : home };
    },
  };
}
