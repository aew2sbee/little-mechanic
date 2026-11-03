import { useState, type CSSProperties } from 'react';
import { screwPositions, ToolArt, type RepairRequest } from '@/features/vehicles';
import { FingerHint, useIdleHint } from '@/shared/hint';
import { useSound } from '@/shared/sound';
import { createScrew, type ScrewAction } from './screw';

interface ScrewLayerProps {
  request: RepairRequest;
  action: ScrewAction;
  onAllDone: () => void;
}

/** The screws of one part, each turned by repeated touches with the chosen tool. */
export function ScrewLayer({ request, action, onAllDone }: ScrewLayerProps) {
  const sound = useSound();
  const showHint = useIdleHint();
  const [positions] = useState(() => screwPositions(request));
  const [screws, setScrews] = useState(() => positions.map(() => createScrew({ action })));
  const [lastTouch, setLastTouch] = useState<{ index: number; count: number }>();

  const touch = (index: number) => {
    const touched = screws[index].touch();
    const next = screws.map((screw, i) => (i === index ? touched : screw));
    setScrews(next);
    setLastTouch({ index, count: (lastTouch?.count ?? 0) + 1 });
    sound.play(touched.isDone ? 'pop' : 'ratchet');
    if (next.every((screw) => screw.isDone)) onAllDone();
  };

  const nextIndex = screws.findIndex((screw) => !screw.isDone);

  return (
    <>
      {screws.map((screw, index) => {
        const style = {
          left: positions[index].x,
          top: positions[index].y,
          '--lift': screw.lift,
          '--turn': `${screw.touches * 150}deg`,
        } as CSSProperties;
        return screw.isDone ? (
          <span key={index} className={`screw screw--${action}-done`} style={style} aria-hidden="true">
            <span className="screw__head" />
          </span>
        ) : (
          <button
            key={index}
            type="button"
            className="screw"
            style={style}
            aria-label="ねじ"
            onPointerDown={() => touch(index)}
          >
            <span className="screw__shaft" />
            <span className="screw__head" />
          </button>
        );
      })}
      {lastTouch && (
        <div
          key={lastTouch.count}
          className="tool-in-hand"
          style={{ left: positions[lastTouch.index].x, top: positions[lastTouch.index].y }}
        >
          <ToolArt tool={request.tool} />
        </div>
      )}
      {showHint && nextIndex >= 0 && <FingerHint at={positions[nextIndex]} />}
    </>
  );
}
