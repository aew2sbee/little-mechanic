import { useState } from 'react';
import { CelebrationScreen } from '@/features/celebration';
import { createRepairFlow, RepairScreen, StepBar, type FinishableStage } from '@/features/repair';
import type { RepairRequest, ToolId } from '@/features/vehicles';
import { HomeButton } from '@/shared/ui';

interface RepairSessionProps {
  request: RepairRequest;
  /** The new part is in and screwed down: the child has earned the sticker. */
  onRepaired: () => void;
  onFinished: () => void;
  onLeave: () => void;
}

/** One vehicle's whole visit, from ① to ④, across the features that handle each step. */
export function RepairSession({ request, onRepaired, onFinished, onLeave }: RepairSessionProps) {
  const [flow, setFlow] = useState(() => createRepairFlow({ correctTool: request.toolId }));

  const pickTool = (tool: ToolId) => setFlow(flow.pickTool(tool));
  const finishStage = (stage: FinishableStage) => {
    const next = flow.finishStage(stage);
    if (next === flow) return;
    if (next.stage === 'celebration') onRepaired();
    setFlow(next);
  };

  const { stage } = flow;

  return (
    <>
      {stage === 'celebration' ? (
        <CelebrationScreen request={request} onComplete={onFinished} />
      ) : (
        <>
          <RepairScreen request={request} stage={stage} onPickTool={pickTool} onFinishStage={finishStage} />
          <div className="session-home">
            <HomeButton onClick={onLeave} />
          </div>
        </>
      )}
      <StepBar stage={stage} />
    </>
  );
}
