import { useState, type CSSProperties } from 'react';
import { PartArt, slotOf, toWorkbench, ToolArt, WorkbenchVehicleArt, type RepairRequest } from '@/features/vehicles';
import { FingerHint, useIdleHint } from '@/shared/hint';
import { useSound } from '@/shared/sound';
import { useInterval, useTimeout, type Point } from '@/shared/ui';
import { createHoldProgress } from './holdProgress';
import { partBoxStyle } from './partBox';
import { useHold } from './useHold';

export type HoldFixKind = 'inflate' | 'oil';

/** How long the tool needs holding until the tyre is full or the engine has its oil. */
export const FIX_HOLD_MS = 2400;
/** Long enough to enjoy the vehicle's smile. */
const FINISH_PAUSE_MS = 800;
/** The CSS fills everything over this time, and only while the tool is held, so it keeps pace with the logic. */
const HOLD_STYLE = { '--hold-ms': `${FIX_HOLD_MS}ms` } as CSSProperties;

const KINDS = {
  inflate: { sound: 'pump', soundGapMs: 300, meter: 'くうき' },
  oil: { sound: 'drip', soundGapMs: 320, meter: 'おいる' },
} as const satisfies Record<HoldFixKind, { sound: string; soundGapMs: number; meter: string }>;

/** The pump stands to the right of the vehicle; the oil can hovers over the engine. */
const PUMP = { x: 1165, y: 640 };
const toolSpot = (kind: HoldFixKind, part: Point): Point =>
  kind === 'inflate' ? PUMP : { x: part.x + 90, y: part.y - 200 };

interface HoldFixProps {
  request: RepairRequest;
  kind: HoldFixKind;
  onFinished: () => void;
}

/** ② for troubles fixed by holding one tool: the pump fills a flat tyre, the oil can feeds a smoking engine. */
export function HoldFix({ request, kind, onFinished }: HoldFixProps) {
  const sound = useSound();
  const showHint = useIdleHint();
  const [fill, setFill] = useState(() => createHoldProgress({ holdMs: FIX_HOLD_MS }));
  const { heldKey, press, release } = useHold(
    () => fill.remainingMs,
    (_key, ms) => {
      const next = fill.hold(ms);
      setFill(next);
      if (next.isDone) sound.play('sparkle');
    },
  );
  const { sound: workSound, soundGapMs, meter } = KINDS[kind];
  const isWorking = heldKey !== undefined;

  useInterval(() => sound.play(workSound), soundGapMs, isWorking);
  useTimeout(onFinished, FINISH_PAUSE_MS, fill.isDone);

  const slot = slotOf(request);
  const part = toWorkbench(slot);
  const tool = toolSpot(kind, part);
  const state = fill.isDone ? 'done' : isWorking ? 'working' : 'waiting';

  return (
    <div className={`hold-fix hold-fix--${state}`} style={HOLD_STYLE}>
      <WorkbenchVehicleArt
        vehicle={request.vehicle}
        expression={fill.isDone ? 'happy' : 'sad'}
        hiddenPart={kind === 'inflate' ? request.partId : undefined}
      />
      {kind === 'inflate' ? (
        <>
          <svg className="pump-hose" viewBox="0 0 1280 800" aria-hidden="true">
            {/* Outlined, so the hose still shows where it crosses a dark vehicle. */}
            {['pump-hose__outline', 'pump-hose__inner'].map((className) => (
              <path
                key={className}
                className={className}
                d={`M${PUMP.x + 33} ${PUMP.y - 29} C${PUMP.x + 70} ${PUMP.y - 190} ${part.x + 160} ${part.y - 170} ${part.x + 34} ${part.y - 24}`}
              />
            ))}
          </svg>
          {/* The flat tyre fades as the full one swells, both paced by the CSS. */}
          <div className="bench-part tyre" style={partBoxStyle(part)}>
            <div className="tyre__flat">
              <PartArt part={request.part} tint={slot.tint} scale={slot.scale} isBroken />
            </div>
            <div className="tyre__full">
              <PartArt part={request.part} tint={slot.tint} scale={slot.scale} />
            </div>
          </div>
        </>
      ) : (
        <>
          {!fill.isDone && (
            <div className="smoke" style={{ left: part.x, top: part.y - 50 }} aria-hidden="true">
              <span className="smoke__puff" />
              <span className="smoke__puff" />
              <span className="smoke__puff" />
            </div>
          )}
          {isWorking && (
            // Below the spout of the tipped can.
            <div className="oil-drops" style={{ left: tool.x - 66, top: tool.y + 14 }} aria-hidden="true">
              <span className="oil-drop" />
              <span className="oil-drop" />
            </div>
          )}
        </>
      )}
      <button
        type="button"
        className={`hold-tool hold-tool--${request.toolId}`}
        style={{ left: tool.x, top: tool.y }}
        aria-label={request.tool.name}
        disabled={fill.isDone}
        onPointerDown={(event) => {
          if (press('tool', event)) sound.play(workSound);
        }}
        onPointerUp={release}
        onPointerCancel={release}
      >
        <ToolArt tool={request.tool} />
      </button>
      <div
        className="fix-meter"
        role="progressbar"
        aria-label={meter}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(fill.progress * 100)}
      >
        <span className="fix-meter__fill" />
      </div>
      {showHint && state === 'waiting' && <FingerHint at={tool} hold />}
    </div>
  );
}
