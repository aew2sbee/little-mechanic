import { useState } from 'react';
import { PartArt, slotOf, toWorkbench, WorkbenchVehicleArt, type RepairRequest } from '@/features/vehicles';
import { useSound } from '@/shared/sound';
import { useTimeout } from '@/shared/ui';
import { partBoxStyle } from './partBox';
import { ScrewLayer } from './ScrewLayer';

/** How long the broken part takes to drop away; the step ends as it disappears. */
const PART_FALL_MS = 900;

interface RemovalStepProps {
  request: RepairRequest;
  onFinished: () => void;
}

/** ② Every screw comes out, and the broken part falls off. */
export function RemovalStep({ request, onFinished }: RemovalStepProps) {
  const sound = useSound();
  const [isRemoved, setIsRemoved] = useState(false);
  const slot = slotOf(request);

  useTimeout(onFinished, PART_FALL_MS, isRemoved);

  return (
    <>
      <WorkbenchVehicleArt vehicle={request.vehicle} expression="sad" hiddenPart={request.partId} />
      <div
        className={isRemoved ? 'bench-part bench-part--falling' : 'bench-part'}
        style={{ ...partBoxStyle(toWorkbench(slot)), animationDuration: `${PART_FALL_MS}ms` }}
      >
        <PartArt part={request.part} tint={slot.tint} scale={slot.scale} isBroken />
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
