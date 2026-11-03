import { useState } from 'react';
import { screwPositions, ToolArt, type RepairRequest } from '@/features/vehicles';
import { FingerHint, useIdleHint } from '@/shared/hint';
import { useHoldProgress } from './useHoldProgress';

/** How long the driver stays on each screw: long enough to feel the motor work, short enough to stay fun. */
export const SCREW_HOLD_MS = 1000;

interface ScrewLayerProps {
  request: RepairRequest;
  action: 'remove' | 'tighten';
  onAllDone: () => void;
}

/** The screws of one part, each turned by holding the electric screwdriver on it. */
export function ScrewLayer({ request, action, onAllDone }: ScrewLayerProps) {
  const showHint = useIdleHint();
  const [positions] = useState(() => screwPositions(request));
  const {
    items: screws,
    heldIndex,
    handlersFor,
    styleFor,
  } = useHoldProgress({
    count: positions.length,
    holdMs: SCREW_HOLD_MS,
    workSound: 'whirr',
    soundGapMs: 200,
    doneSound: 'pop',
    onDone: (all) => {
      if (all.every((screw) => screw.isDone)) onAllDone();
    },
  });

  const nextIndex = screws.findIndex((screw) => !screw.isDone);

  return (
    <>
      {screws.map((screw, index) => {
        const style = { ...styleFor(index), left: positions[index].x, top: positions[index].y };
        return screw.isDone ? (
          <span key={index} className={`screw screw--${action} screw--done`} style={style} aria-hidden="true">
            <span className="screw__head" />
          </span>
        ) : (
          <button
            key={index}
            type="button"
            className={`screw screw--${action}`}
            style={style}
            aria-label="ねじ"
            {...handlersFor(index)}
          >
            <span className="screw__head" />
          </button>
        );
      })}
      {heldIndex !== undefined && (
        <div className="tool-in-hand" style={{ left: positions[heldIndex].x, top: positions[heldIndex].y }}>
          <ToolArt tool={request.tool} />
        </div>
      )}
      {showHint && heldIndex === undefined && nextIndex >= 0 && <FingerHint at={positions[nextIndex]} hold />}
    </>
  );
}
