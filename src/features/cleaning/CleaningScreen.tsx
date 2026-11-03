import { useRef, useState } from 'react';
import { toWorkbench, VEHICLE_VIEW, WorkbenchVehicleArt, type RepairRequest } from '@/features/vehicles';
import { FingerHint, useIdleHint } from '@/shared/hint';
import { useSound } from '@/shared/sound';
import { GarageBackdrop, useTimeout, type Point } from '@/shared/ui';
import { createCleaningProgress } from './cleaningProgress';
import { DirtCanvas } from './DirtCanvas';
import { dirtBlobs } from './dirtBlobs';
import { createDirtGrid } from './dirtGrid';
import './cleaning.css';

/** Half the width of the sponge, in vehicle units. */
const WIPE_RADIUS = 46;
const GRID_CELL = 12;
/** Long enough to enjoy the shine. */
const FINISH_PAUSE_MS = 1300;
const SCRUB_SOUND_GAP_MS = 110;

const cleaning = createCleaningProgress();

interface CleaningScreenProps {
  request: RepairRequest;
  onComplete: () => void;
}

/** ④ The child rubs the mud off until the vehicle shines. */
export function CleaningScreen({ request, onComplete }: CleaningScreenProps) {
  const sound = useSound();
  const showHint = useIdleHint();
  const [{ blobs, grid }] = useState(() => {
    const mud = dirtBlobs(request.dirt);
    return { blobs: mud, grid: createDirtGrid({ spots: mud, ...VEHICLE_VIEW, cellSize: GRID_CELL }) };
  });
  const [ratio, setRatio] = useState(() => grid.cleanRatio());
  const [sponge, setSponge] = useState<Point>();
  const lastScrubRef = useRef(0);
  const { progress, isComplete } = cleaning.update(ratio);

  useTimeout(onComplete, FINISH_PAUSE_MS, isComplete);

  const handleWipe = (from: Point, to: Point, time: number) => {
    setSponge(toWorkbench(to));
    if (isComplete) return;
    const next = grid.wipe(from, to, WIPE_RADIUS);
    if (next === ratio) return;
    setRatio(next);
    if (cleaning.update(next).isComplete) {
      sound.play('sparkle');
    } else if (time - lastScrubRef.current > SCRUB_SOUND_GAP_MS) {
      sound.play('scrub');
      lastScrubRef.current = time;
    }
  };

  const [firstSpot] = request.dirt;

  return (
    <div className="screen" data-screen="cleaning">
      <GarageBackdrop />
      <WorkbenchVehicleArt vehicle={request.vehicle} expression={isComplete ? 'happy' : 'sad'} />
      <DirtCanvas
        blobs={blobs}
        radius={WIPE_RADIUS}
        isCleared={isComplete}
        onWipe={(from, to) => handleWipe(from, to, performance.now())}
        onRelease={() => setSponge(undefined)}
      />
      {sponge && (
        // Moved with `translate` so following the finger needs no layout.
        <div className="sponge" style={{ translate: `${sponge.x}px ${sponge.y}px` }} aria-hidden="true">
          <span className="sponge__bubble" />
          <span className="sponge__bubble" />
          <span className="sponge__bubble" />
        </div>
      )}
      {isComplete && (
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
        aria-valuenow={Math.round(progress * 100)}
      >
        <span className="clean-meter__fill" style={{ width: `${progress * 100}%` }} />
      </div>
      {showHint && !isComplete && (
        <FingerHint
          at={toWorkbench({ x: firstSpot.x - 60, y: firstSpot.y })}
          dragTo={toWorkbench({ x: firstSpot.x + 120, y: firstSpot.y })}
        />
      )}
    </div>
  );
}
