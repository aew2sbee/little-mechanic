import { useEffect, useState } from 'react';
import { PartArt, slotOf, toWorkbench, VehicleArt, WORKBENCH_BOX, type RepairRequest } from '@/features/vehicles';
import { useSound } from '@/shared/sound';
import { partBoxStyle } from './partBox';
import { ScrewLayer } from './ScrewLayer';

/** Long enough to watch the broken part drop away. */
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

  useEffect(() => {
    if (!isRemoved) return;
    const timer = setTimeout(onFinished, PART_FALL_MS);
    return () => clearTimeout(timer);
  }, [isRemoved, onFinished]);

  return (
    <>
      <VehicleArt
        className="bench-car"
        style={WORKBENCH_BOX}
        vehicle={request.vehicle}
        expression="sad"
        hiddenPart={request.partId}
      />
      <div
        className={isRemoved ? 'bench-part bench-part--falling' : 'bench-part'}
        style={partBoxStyle(toWorkbench(slot))}
        data-testid="broken-part"
      >
        <PartArt part={request.part} slot={slot} isBroken />
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
