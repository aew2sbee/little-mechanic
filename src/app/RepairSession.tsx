import { useState } from 'react';
import { CelebrationScreen } from '@/features/celebration';
import { CleaningScreen } from '@/features/cleaning';
import { createRepairFlow, RepairScreen, StepBar, type FinishableStage } from '@/features/repair';
import type { RepairRequest, ToolId } from '@/features/vehicles';
import { HomeButton } from '@/shared/ui';

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

  const pickTool = (tool: ToolId) => setFlow((current) => current.pickTool(tool));
  const finishStage = (stage: FinishableStage) => setFlow((current) => current.finishStage(stage));

  const { stage } = flow;

  return (
    <>
      {(stage === 'trouble' || stage === 'removal' || stage === 'installation') && (
        <RepairScreen request={request} stage={stage} onPickTool={pickTool} onFinishStage={finishStage} />
      )}
      {stage === 'cleaning' && (
        <CleaningScreen
          request={request}
          onComplete={() => {
            onRepaired();
            finishStage('cleaning');
          }}
        />
      )}
      {stage === 'celebration' && <CelebrationScreen request={request} onComplete={onFinished} />}
      {stage !== 'celebration' && (
        <div className="session-home">
          <HomeButton onClick={onLeave} />
        </div>
      )}
      <StepBar stage={stage} />
    </>
  );
}
