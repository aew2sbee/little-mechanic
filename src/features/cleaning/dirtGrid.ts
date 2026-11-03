import type { DirtSpot } from '@/features/vehicles';
import type { Point } from '@/shared/ui';

interface DirtGridOptions {
  spots: DirtSpot[];
  width: number;
  height: number;
  /** Side of a measuring cell. Smaller is more exact and slower. */
  cellSize: number;
}

export interface DirtGrid {
  /** How much of the dirt is gone, from 0 to 1. */
  cleanRatio(): number;
  /** Wipes along a finger movement and returns the new `cleanRatio`. */
  wipe(from: Point, to: Point, radius: number): number;
}

/** Measures dirt on a coarse grid, so "how clean is it?" does not depend on the screen's pixels. */
export function createDirtGrid({ spots, width, height, cellSize }: DirtGridOptions): DirtGrid {
  const columns = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);
  const cellCentre = (index: number) => ({
    x: ((index % columns) + 0.5) * cellSize,
    y: (Math.floor(index / columns) + 0.5) * cellSize,
  });

  const isDirty = Array.from({ length: columns * rows }, (_, index) => {
    const cell = cellCentre(index);
    return spots.some((spot) => Math.hypot(cell.x - spot.x, cell.y - spot.y) <= spot.r);
  });
  const total = isDirty.filter(Boolean).length;
  let remaining = total;

  const cleanRatio = () => (total === 0 ? 1 : 1 - remaining / total);

  const wipeCircle = (centre: Point, radius: number) => {
    const firstRow = Math.max(0, Math.floor((centre.y - radius) / cellSize));
    const lastRow = Math.min(rows - 1, Math.floor((centre.y + radius) / cellSize));
    const firstColumn = Math.max(0, Math.floor((centre.x - radius) / cellSize));
    const lastColumn = Math.min(columns - 1, Math.floor((centre.x + radius) / cellSize));
    for (let row = firstRow; row <= lastRow; row += 1) {
      for (let column = firstColumn; column <= lastColumn; column += 1) {
        const index = row * columns + column;
        const cell = cellCentre(index);
        if (isDirty[index] && Math.hypot(cell.x - centre.x, cell.y - centre.y) <= radius) {
          isDirty[index] = false;
          remaining -= 1;
        }
      }
    }
  };

  return {
    cleanRatio,
    wipe(from, to, radius) {
      // Fast fingers report points far apart; step between them so no dirt is skipped.
      const steps = Math.max(1, Math.ceil(Math.hypot(to.x - from.x, to.y - from.y) / (radius / 2)));
      for (let step = 0; step <= steps; step += 1) {
        const t = step / steps;
        wipeCircle({ x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t }, radius);
      }
      return cleanRatio();
    },
  };
}
