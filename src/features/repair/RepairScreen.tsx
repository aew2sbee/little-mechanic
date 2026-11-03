import type { RepairRequest, ToolId } from '@/features/vehicles';
import { GarageBackdrop } from '@/shared/ui';
import { HoldFix } from './HoldFix';
import { ReplaceFix } from './ReplaceFix';
import { TroubleStep } from './TroubleStep';
import './repair.css';

interface RepairScreenProps {
  request: RepairRequest;
  stage: 'trouble' | 'fixing';
  onPickTool: (tool: ToolId) => void;
  /** ② is over: the vehicle is as good as new. */
  onFixed: () => void;
}

/** Steps ① and ② of a repair, which happen on the workbench. */
export function RepairScreen({ request, stage, onPickTool, onFixed }: RepairScreenProps) {
  return (
    <div className="screen" data-screen="repair">
      <GarageBackdrop />
      {stage === 'trouble' && <TroubleStep request={request} onPickTool={onPickTool} />}
      {stage === 'fixing' &&
        (request.fix === 'replace' ? (
          <ReplaceFix request={request} onFinished={onFixed} />
        ) : (
          <HoldFix request={request} kind={request.fix} onFinished={onFixed} />
        ))}
    </div>
  );
}
