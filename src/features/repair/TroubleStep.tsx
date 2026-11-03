import { useState } from 'react';
import { ALL_TOOLS, PartArt, slotOf, ToolArt, TroubleBadge, WorkbenchVehicleArt } from '@/features/vehicles';
import type { RepairRequest, ToolId } from '@/features/vehicles';
import { FingerHint, useIdleHint } from '@/shared/hint';
import { useSound } from '@/shared/sound';
import { STAGE_SIZE } from '@/shared/ui';

const TOOL_BUTTON = { width: 170, height: 124, gap: 28, top: 662 };

const toolLeft = (index: number) => {
  const total = ALL_TOOLS.length * TOOL_BUTTON.width + (ALL_TOOLS.length - 1) * TOOL_BUTTON.gap;
  return STAGE_SIZE.width / 2 - total / 2 + index * (TOOL_BUTTON.width + TOOL_BUTTON.gap);
};

interface TroubleStepProps {
  request: RepairRequest;
  onPickTool: (tool: ToolId) => void;
}

/** ① The vehicle shows what hurts, and the child finds the tool that fits the shadow. */
export function TroubleStep({ request, onPickTool }: TroubleStepProps) {
  const sound = useSound();
  const showHint = useIdleHint();
  const [nudge, setNudge] = useState<{ tool: ToolId; count: number }>();

  const pick = (tool: ToolId) => {
    if (tool === request.toolId) {
      sound.play('clunk');
    } else {
      // Not a failure: the tool just wiggles, and the child can try another.
      sound.play('nope');
      setNudge({ tool, count: (nudge?.count ?? 0) + 1 });
    }
    onPickTool(tool);
  };

  const correctIndex = ALL_TOOLS.findIndex(([id]) => id === request.toolId);

  return (
    <>
      <WorkbenchVehicleArt
        className="bench-car--arrive"
        vehicle={request.vehicle}
        expression="sad"
        brokenPart={request.partId}
      />
      {/* The vehicle says what is wrong. The pictures tell it too, for children who cannot read yet. */}
      <div className="trouble-bubble">
        <p className="trouble-bubble__words">{request.trouble}</p>
        <div className="trouble-bubble__pictures">
          <div className="trouble-bubble__part" role="img" aria-label={request.part.name}>
            <PartArt part={request.part} tint={slotOf(request).tint} isBroken viewSize={170} />
            <TroubleBadge icon={request.icon} className="trouble-bubble__badge" />
          </div>
          <div
            className="trouble-bubble__tool"
            role="img"
            aria-label={`${request.tool.name}を つかおう`}
            data-testid="needed-tool"
            data-tool={request.toolId}
          >
            <ToolArt tool={request.tool} silhouette />
          </div>
        </div>
      </div>
      <div className="tool-tray" role="group" aria-label="こうぐ">
        {ALL_TOOLS.map(([id, tool], index) => (
          <button
            key={nudge?.tool === id ? `${id}-${nudge.count}` : id}
            type="button"
            className={nudge?.tool === id ? 'tool-button tool-button--nope' : 'tool-button'}
            style={{ left: toolLeft(index), top: TOOL_BUTTON.top, width: TOOL_BUTTON.width, height: TOOL_BUTTON.height }}
            aria-label={tool.name}
            data-tool={id}
            onClick={() => pick(id)}
          >
            <ToolArt tool={tool} />
          </button>
        ))}
      </div>
      {showHint && (
        <FingerHint
          at={{ x: toolLeft(correctIndex) + TOOL_BUTTON.width / 2, y: TOOL_BUTTON.top + TOOL_BUTTON.height / 2 }}
        />
      )}
    </>
  );
}
