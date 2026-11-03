import { useState } from 'react';
import { slotOf, toWorkbench, WorkbenchVehicleArt, type RepairRequest } from '@/features/vehicles';
import { FingerHint, useIdleHint } from '@/shared/hint';
import { useSound } from '@/shared/sound';
import { useTimeout } from '@/shared/ui';
import { DraggablePart } from './DraggablePart';
import { ScrewLayer } from './ScrewLayer';
import { FINISH_PAUSE_MS } from './timing';

const PART_HOME = { x: 640, y: 712 };
const SNAP_RADIUS = 120;

type Phase = 'placing' | 'tightening' | 'finished';

interface InstallationStepProps {
  request: RepairRequest;
  onFinished: () => void;
}

/** The new part goes in its place, and the screws go back in. */
export function InstallationStep({ request, onFinished }: InstallationStepProps) {
  const sound = useSound();
  const showHint = useIdleHint();
  const [phase, setPhase] = useState<Phase>('placing');
  const slot = toWorkbench(slotOf(request));

  useTimeout(onFinished, FINISH_PAUSE_MS, phase === 'finished');

  return (
    <>
      <WorkbenchVehicleArt
        vehicle={request.vehicle}
        expression={phase === 'finished' ? 'happy' : 'sad'}
        hiddenPart={request.partId}
      />
      {phase === 'placing' && (
        <>
          <div className="part-slot" style={{ left: slot.x, top: slot.y }} data-testid="part-slot" />
          <div className="part-pallet" style={{ left: PART_HOME.x, top: PART_HOME.y }} />
        </>
      )}
      <DraggablePart
        request={request}
        slot={slot}
        home={PART_HOME}
        radius={SNAP_RADIUS}
        onSnapped={() => setPhase('tightening')}
      />
      {phase !== 'placing' && (
        <ScrewLayer
          request={request}
          action="tighten"
          onAllDone={() => {
            sound.play('sparkle');
            setPhase('finished');
          }}
        />
      )}
      {phase === 'placing' && showHint && <FingerHint at={PART_HOME} dragTo={slot} />}
    </>
  );
}
