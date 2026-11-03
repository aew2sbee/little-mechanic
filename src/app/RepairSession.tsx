import { useCallback, useState } from 'react';
import { CelebrationScreen } from '@/features/celebration';
import { CleaningScreen } from '@/features/cleaning';
import { createRepairFlow, RepairScreen, StepBar, type FinishableStage } from '@/features/repair';
import type { RepairRequest, ToolId } from '@/features/vehicles';
import { HomeIcon, IconButton } from '@/shared/ui';

interface RepairSessionProps {
  request: RepairRequest;
  /** The vehicle is fixed and clean: the child has earned the sticker. */
  onRepaired: () => void;
  onFinished: () => void;
  onLeave: () => void;
}

/** One vehicle's whole visit, from ① to ⑤, across the features that handle each step. */
export function RepairSession({ request, onRepaired, onFinished, onLeave }: RepairSessionProps) {
  const [flow, setFlow] = useState(() => createRepairFlow({ correctTool: request.toolId }));

  const pickTool = useCallback((tool: ToolId) => setFlow((current) => current.pickTool(tool)), []);
  const finishStage = useCallback(
    (stage: FinishableStage) => setFlow((current) => current.finishStage(stage)),
    [],
  );
  const finishCleaning = useCallback(() => {
    onRepaired();
    finishStage('cleaning');
  }, [onRepaired, finishStage]);

  const { stage } = flow;

  return (
    <>
      {(stage === 'trouble' || stage === 'removal' || stage === 'installation') && (
        <RepairScreen request={request} stage={stage} onPickTool={pickTool} onFinishStage={finishStage} />
      )}
      {stage === 'cleaning' && <CleaningScreen request={request} onComplete={finishCleaning} />}
      {stage === 'celebration' && <CelebrationScreen request={request} onComplete={onFinished} />}
      {stage !== 'celebration' && (
        <div className="session-home">
          <IconButton label="がれーじ" onClick={onLeave}>
            <HomeIcon />
          </IconButton>
        </div>
      )}
      <StepBar stage={stage} />
    </>
  );
}
