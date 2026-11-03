import { useState } from 'react';
import { slotOf, toWorkbench, WorkbenchVehicleArt, type RepairRequest } from '@/features/vehicles';
import { useSound } from '@/shared/sound';
import { useTimeout } from '@/shared/ui';
import { BenchPartArt, partBoxStyle } from './partBox';
import { ScrewLayer } from './ScrewLayer';

/** How long the broken part takes to drop away; the step ends as it disappears. */
export const PART_FALL_MS = 900;

interface RemovalStepProps {
  request: RepairRequest;
  onFinished: () => void;
}

/** Every screw comes out, and the broken part falls off. */
export function RemovalStep({ request, onFinished }: RemovalStepProps) {
  const sound = useSound();
  const [isRemoved, setIsRemoved] = useState(false);

  useTimeout(onFinished, PART_FALL_MS, isRemoved);

  return (
    <>
      <WorkbenchVehicleArt vehicle={request.vehicle} expression="sad" hiddenPart={request.partId} />
      <div
        className={isRemoved ? 'bench-part bench-part--falling' : 'bench-part'}
        style={{ ...partBoxStyle(toWorkbench(slotOf(request))), animationDuration: `${PART_FALL_MS}ms` }}
      >
        <BenchPartArt request={request} isBroken />
      </div>
      <ScrewLayer
        request={request}
        action="remove"
        onAllDone={() => {
          sound.play('clunk');
          setIsRemoved(true);
        }}
      />
    </>
  );
}
