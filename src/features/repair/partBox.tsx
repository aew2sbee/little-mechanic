import type { CSSProperties } from 'react';
import { PART_VIEW_SIZE, PartArt, slotOf, WORKBENCH, type RepairRequest } from '@/features/vehicles';
import type { Point } from '@/shared/ui';

const SIZE = PART_VIEW_SIZE * WORKBENCH.scale;

/** Places a `PartArt` so its middle is at `position`, in stage coordinates. */
export function partBoxStyle(position: Point): CSSProperties {
  return { left: position.x - SIZE / 2, top: position.y - SIZE / 2, width: SIZE, height: SIZE };
}

/** The request's part as it is on the workbench vehicle: in the vehicle's colour, at its size there. */
export function BenchPartArt({ request, isBroken = false }: { request: RepairRequest; isBroken?: boolean }) {
  const { tint, scale } = slotOf(request);
  return <PartArt part={request.part} tint={tint} scale={scale} isBroken={isBroken} />;
}
