import { useEffect, useRef, useState } from 'react';
import { toWorkbench, VehicleArt, VEHICLE_VIEW, WORKBENCH_BOX, type RepairRequest } from '@/features/vehicles';
import { FingerHint, useIdleHint } from '@/shared/hint';
import { useSound } from '@/shared/sound';
import { GarageBackdrop, type Point } from '@/shared/ui';
import { createCleaningProgress } from './cleaningProgress';
import { DirtCanvas } from './DirtCanvas';
import { createDirtGrid } from './dirtGrid';
import './cleaning.css';

/** Half the width of the sponge, in vehicle units. */
const WIPE_RADIUS = 46;
const GRID_CELL = 12;
/** Long enough to enjoy the shine. */
const FINISH_PAUSE_MS = 1300;
const SCRUB_SOUND_GAP_MS = 110;

interface CleaningScreenProps {
  request: RepairRequest;
  onComplete: () => void;
}

/** ④ The child rubs the mud off until the vehicle shines. */
export function CleaningScreen({ request, onComplete }: CleaningScreenProps) {
  const sound = useSound();
  const showHint = useIdleHint();
  const [grid] = useState(() =>
    createDirtGrid({ spots: request.dirt, ...VEHICLE_VIEW, cellSize: GRID_CELL }),
  );
  const [cleaning] = useState(() => createCleaningProgress());
  const [state, setState] = useState(() => cleaning.update(grid.cleanRatio()));
  const [sponge, setSponge] = useState<Point>();
  const lastScrubRef = useRef(0);

  useEffect(() => {
    if (!state.isComplete) return;
    sound.play('sparkle');
    const timer = setTimeout(onComplete, FINISH_PAUSE_MS);
    return () => clearTimeout(timer);
  }, [state.isComplete, onComplete, sound]);

  const handleWipe = (from: Point, to: Point, time: number) => {
    setSponge(toWorkbench(to));
    if (state.isComplete) return;
    const ratio = grid.wipe(from, to, WIPE_RADIUS);
    if (ratio !== state.ratio) {
      setState(cleaning.update(ratio));
      if (time - lastScrubRef.current > SCRUB_SOUND_GAP_MS) {
        sound.play('scrub');
        lastScrubRef.current = time;
      }
    }
  };

  const [firstSpot] = request.dirt;

  return (
    <div className="screen" data-screen="cleaning">
      <GarageBackdrop />
      <VehicleArt
        className="bench-car-clean"
        style={WORKBENCH_BOX}
        vehicle={request.vehicle}
        expression={state.isComplete ? 'happy' : 'sad'}
      />
      <DirtCanvas
        spots={request.dirt}
        radius={WIPE_RADIUS}
        isCleared={state.isComplete}
        onWipe={(from, to) => handleWipe(from, to, performance.now())}
        onRelease={() => setSponge(undefined)}
      />
      {sponge && (
        <div className="sponge" style={{ left: sponge.x, top: sponge.y }} aria-hidden="true">
          <span className="sponge__bubble" />
          <span className="sponge__bubble" />
          <span className="sponge__bubble" />
        </div>
      )}
      {state.isComplete && (
        <div className="shine" aria-hidden="true">
          {[18, 42, 66, 84].map((left, index) => (
            <span key={left} className="shine__star" style={{ left: `${left}%`, animationDelay: `${index * 0.12}s` }} />
          ))}
        </div>
      )}
      <div
        className="clean-meter"
        role="progressbar"
        aria-label="きれいさ"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(state.progress * 100)}
      >
        <span className="clean-meter__fill" style={{ width: `${state.progress * 100}%` }} />
      </div>
      {showHint && !state.isComplete && (
        <FingerHint
          at={toWorkbench({ x: firstSpot.x - 60, y: firstSpot.y })}
          dragTo={toWorkbench({ x: firstSpot.x + 120, y: firstSpot.y })}
        />
      )}
    </div>
  );
}
