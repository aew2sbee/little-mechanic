import type { CSSProperties } from 'react';
import { PART_VIEW_SIZE, WORKBENCH } from '@/features/vehicles';
import type { Point } from '@/shared/ui';

const SIZE = PART_VIEW_SIZE * WORKBENCH.scale;

/** Places a `PartArt` so its middle is at `position`, in stage coordinates. */
export function partBoxStyle(position: Point): CSSProperties {
  return { left: position.x - SIZE / 2, top: position.y - SIZE / 2, width: SIZE, height: SIZE };
}
