import type { RepairRequest, ToolId } from '@/features/vehicles';
import { GarageBackdrop } from '@/shared/ui';
import { InstallationStep } from './InstallationStep';
import { RemovalStep } from './RemovalStep';
import type { FinishableStage, RepairStage } from './repairFlow';
import { TroubleStep } from './TroubleStep';
import './repair.css';

interface RepairScreenProps {
  request: RepairRequest;
  stage: RepairStage;
  onPickTool: (tool: ToolId) => void;
  onFinishStage: (stage: FinishableStage) => void;
}

/** Steps ① to ③ of a repair, which all happen on the workbench. */
export function RepairScreen({ request, stage, onPickTool, onFinishStage }: RepairScreenProps) {
  return (
    <div className="screen" data-screen="repair">
      <GarageBackdrop />
      {stage === 'trouble' && <TroubleStep request={request} onPickTool={onPickTool} />}
      {stage === 'removal' && <RemovalStep request={request} onFinished={() => onFinishStage('removal')} />}
      {stage === 'installation' && (
        <InstallationStep request={request} onFinished={() => onFinishStage('installation')} />
      )}
    </div>
  );
}
