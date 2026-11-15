import { useState } from 'react';
import type { RepairRequest, ToolId } from '@/features/vehicles';
import { useSound } from '@/shared/sound';
import { GarageBackdrop, useTimeout } from '@/shared/ui';
import { HoldFix } from './HoldFix';
import { ReplaceFix } from './ReplaceFix';
import { TroubleStep } from './TroubleStep';
import './repair.css';

/** The pause at the end of ②, long enough to enjoy the vehicle's smile before it drives off. */
const FINISH_PAUSE_MS = 800;

interface RepairScreenProps {
  request: RepairRequest;
  stage: 'trouble' | 'fixing';
  onPickTool: (tool: ToolId) => void;
  /** ② is over: the vehicle is as good as new. */
  onFixed: () => void;
}

/** Steps ① and ② of a repair, which happen on the workbench. */
export function RepairScreen({ request, stage, onPickTool, onFixed }: RepairScreenProps) {
  const sound = useSound();
  const [isFixed, setIsFixed] = useState(false);

  useTimeout(onFixed, FINISH_PAUSE_MS, isFixed);

  // However ② went, it ends the same way: a sparkle, then a moment to see the vehicle smile.
  const finishFixing = () => {
    sound.play('sparkle');
    setIsFixed(true);
  };

  return (
    <div className="screen" data-screen="repair">
      <GarageBackdrop />
      {stage === 'trouble' && <TroubleStep request={request} onPickTool={onPickTool} />}
      {stage === 'fixing' &&
        (request.fix === 'replace' ? (
          <ReplaceFix request={request} onFinished={finishFixing} />
        ) : (
          <HoldFix request={request} kind={request.fix} onFinished={finishFixing} />
        ))}
    </div>
  );
}
