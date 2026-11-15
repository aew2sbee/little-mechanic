import { useState } from 'react';
import { CelebrationScreen } from '@/features/celebration';
import { createRepairFlow, RepairScreen, StepBar } from '@/features/repair';
import type { RepairRequest, ToolId } from '@/features/vehicles';
import { HomeButton } from '@/shared/ui';

interface RepairSessionProps {
  request: RepairRequest;
  /** ② is done (new part, air or oil): the child has earned the sticker. */
  onRepaired: () => void;
  onFinished: () => void;
  onLeave: () => void;
}

/** One vehicle's whole visit, from ① to ③, across the features that handle each step. */
export function RepairSession({ request, onRepaired, onFinished, onLeave }: RepairSessionProps) {
  const [flow, setFlow] = useState(() => createRepairFlow({ correctTool: request.toolId }));

  const pickTool = (tool: ToolId) => setFlow(flow.pickTool(tool));
  const fixed = () => {
    const next = flow.finishFixing();
    if (next === flow) return;
    onRepaired();
    setFlow(next);
  };

  const { stage } = flow;

  return (
    <>
      {stage === 'celebration' ? (
        <CelebrationScreen request={request} onComplete={onFinished} />
      ) : (
        <>
          <RepairScreen request={request} stage={stage} onPickTool={pickTool} onFixed={fixed} />
          <div className="session-home">
            <HomeButton onClick={onLeave} />
          </div>
        </>
      )}
      <StepBar stage={stage} />
    </>
  );
}
