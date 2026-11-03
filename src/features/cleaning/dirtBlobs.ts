import type { DirtSpot } from '@/features/vehicles';

const BLOBS_PER_SPOT = 18;

export interface DirtBlob {
  x: number;
  y: number;
  r: number;
  /** Which mud colour to paint it with; the canvas owns the colours. */
  shade: number;
}

/**
 * Turns each dirt spot into overlapping round blobs of mud. Both the drawing and the cleanliness
 * measure use these blobs, so the meter counts exactly the mud the child can see.
 * Positions are fixed, so each vehicle gets dirty the same way.
 */
export function dirtBlobs(spots: readonly DirtSpot[]): DirtBlob[] {
  return spots.flatMap((spot, spotIndex) =>
    Array.from({ length: BLOBS_PER_SPOT }, (_, blob) => {
      const angle = blob * 2.4 + spotIndex;
      const distance = spot.r * (0.1 + (blob % 5) * 0.16);
      return {
        x: spot.x + Math.cos(angle) * distance,
        y: spot.y + Math.sin(angle) * distance,
        r: spot.r * (0.26 + ((blob * 7) % 4) * 0.08),
        shade: blob + spotIndex,
      };
    }),
  );
}
