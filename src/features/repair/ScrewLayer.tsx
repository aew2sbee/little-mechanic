import { useState, type CSSProperties } from 'react';
import { screwPositions, ToolArt, type RepairRequest } from '@/features/vehicles';
import { FingerHint, useIdleHint } from '@/shared/hint';
import { useSound } from '@/shared/sound';
import { useInterval } from '@/shared/ui';
import { createHoldProgress } from './holdProgress';
import { useHold } from './useHold';

/** How long the driver stays on each screw: long enough to feel the motor work, short enough to stay fun. */
export const SCREW_HOLD_MS = 1000;
const WHIRR_GAP_MS = 200;
/** The CSS turns each screw over this time, and only while it is held, so it keeps pace with the logic. */
const HOLD_STYLE = { '--hold-ms': `${SCREW_HOLD_MS}ms` } as CSSProperties;

export type ScrewAction = 'remove' | 'tighten';

interface ScrewLayerProps {
  request: RepairRequest;
  action: ScrewAction;
  onAllDone: () => void;
}

/** The screws of one part, each turned by holding the electric screwdriver on it. */
export function ScrewLayer({ request, action, onAllDone }: ScrewLayerProps) {
  const sound = useSound();
  const showHint = useIdleHint();
  const [positions] = useState(() => screwPositions(request));
  const [screws, setScrews] = useState(() => positions.map(() => createHoldProgress({ holdMs: SCREW_HOLD_MS })));

  const { heldKey, press, release } = useHold(
    (index: number) => screws[index].remainingMs,
    (index, ms) => {
      const turned = screws[index].hold(ms);
      const next = screws.map((screw, i) => (i === index ? turned : screw));
      setScrews(next);
      if (!turned.isDone) return;
      sound.play('pop');
      if (next.every((screw) => screw.isDone)) onAllDone();
    },
  );
  useInterval(() => sound.play('whirr'), WHIRR_GAP_MS, heldKey !== undefined);

  const nextIndex = screws.findIndex((screw) => !screw.isDone);

  return (
    <>
      {screws.map((screw, index) => {
        const style = { ...HOLD_STYLE, left: positions[index].x, top: positions[index].y };
        return screw.isDone ? (
          <span key={index} className={`screw screw--${action} screw--done`} style={style} aria-hidden="true">
            <span className="screw__head" />
          </span>
        ) : (
          <button
            key={index}
            type="button"
            className={heldKey === index ? `screw screw--${action} screw--turning` : `screw screw--${action}`}
            style={style}
            aria-label="ねじ"
            onPointerDown={(event) => {
              if (press(index, event)) sound.play('whirr');
            }}
            onPointerUp={release}
            onPointerCancel={release}
          >
            <span className="screw__shaft" />
            <span className="screw__head" />
          </button>
        );
      })}
      {heldKey !== undefined && (
        <div className="tool-in-hand" style={{ left: positions[heldKey].x, top: positions[heldKey].y }}>
          <ToolArt tool={request.tool} />
        </div>
      )}
      {showHint && heldKey === undefined && nextIndex >= 0 && <FingerHint at={positions[nextIndex]} hold />}
    </>
  );
}
