import type { CSSProperties, ReactNode } from 'react';
import {
  PartArt,
  partPoint,
  slotOf,
  toWorkbench,
  ToolArt,
  WorkbenchVehicleArt,
  type FixKind,
  type RepairRequest,
} from '@/features/vehicles';
import { FingerHint, useIdleHint } from '@/shared/hint';
import { useSound, type SoundName } from '@/shared/sound';
import { StageBackdrop, useTimeout, type Point } from '@/shared/ui';
import { partBoxStyle } from './partBox';
import { FINISH_PAUSE_MS } from './timing';
import { useHoldProgress } from './useHoldProgress';

/** How long the tool needs holding until the tyre is full or the engine has its oil. */
export const FIX_HOLD_MS = 2400;
/** The CSS fills everything over this time, and only while the tool is held, so it keeps pace with the logic. */
const HOLD_STYLE = { '--hold-ms': `${FIX_HOLD_MS}ms` } as CSSProperties;

/** The pump stands on the floor to the right of the vehicle. */
const PUMP = { x: 1165, y: 640 };
/** Where the end of the hose in the pump's own drawing ends up, from the middle of its button. */
const PUMP_HOSE_END = { x: 33, y: -29 };
/** Points on the part, relative to its middle in its own size, like screw positions. */
const TYRE_VALVE = { x: 23, y: -16 };
const ENGINE_TOP = { x: 0, y: -42 };
const OIL_CAN_OVER_ENGINE = { x: 75, y: -167 };
/** The spout of the oil can once the CSS has tipped it (`.hold-fix--oil` below), from the can's middle. */
const TIPPED_SPOUT = { x: -66, y: 14 };

interface SceneProps {
  request: RepairRequest;
  /** Middle of the tool's button. */
  tool: Point;
  isWorking: boolean;
  isDone: boolean;
}

/** A hose from the pump to the tyre, and the tyre, which swells from flat to full as the CSS runs. */
function TyreScene({ request }: SceneProps) {
  const slot = slotOf(request);
  const valve = partPoint(request, TYRE_VALVE);
  const start = { x: PUMP.x + PUMP_HOSE_END.x, y: PUMP.y + PUMP_HOSE_END.y };
  const hose = `M${start.x} ${start.y} C${start.x + 37} ${start.y - 161} ${valve.x + 126} ${valve.y - 146} ${valve.x} ${valve.y}`;
  return (
    <>
      <StageBackdrop>
        {/* Outlined, so the hose still shows where it crosses a dark vehicle. */}
        <path className="pump-hose__outline" d={hose} />
        <path className="pump-hose__inner" d={hose} />
      </StageBackdrop>
      <div className="bench-part tyre" style={partBoxStyle(toWorkbench(slot))}>
        <div className="tyre__flat">
          <PartArt part={request.part} tint={slot.tint} scale={slot.scale} isBroken />
        </div>
        <div className="tyre__full">
          <PartArt part={request.part} tint={slot.tint} scale={slot.scale} />
        </div>
      </div>
    </>
  );
}

/** Smoke rising from the engine, which the CSS clears as oil goes in, and drops while it pours. */
function EngineScene({ request, tool, isWorking, isDone }: SceneProps) {
  const top = partPoint(request, ENGINE_TOP);
  return (
    <>
      {!isDone && (
        <div className="smoke" style={{ left: top.x, top: top.y }} aria-hidden="true">
          <span className="smoke__puff" />
          <span className="smoke__puff" />
          <span className="smoke__puff" />
        </div>
      )}
      {isWorking && (
        <div className="oil-drops" style={{ left: tool.x + TIPPED_SPOUT.x, top: tool.y + TIPPED_SPOUT.y }} aria-hidden="true">
          <span className="oil-drop" />
          <span className="oil-drop" />
        </div>
      )}
    </>
  );
}

type HoldFixKind = Exclude<FixKind, 'replace'>;

interface HoldFixDesign {
  /** Repeats while the tool is held. The gaps match the CSS: one push of the pump, one drop of oil. */
  sound: SoundName;
  soundGapMs: number;
  meter: string;
  toolAt: (request: RepairRequest) => Point;
  /** Leaves the part off the vehicle, because the scene draws it. */
  drawsPart: boolean;
  Scene: (props: SceneProps) => ReactNode;
}

const DESIGNS: Record<HoldFixKind, HoldFixDesign> = {
  inflate: { sound: 'pump', soundGapMs: 300, meter: 'くうき', toolAt: () => PUMP, drawsPart: true, Scene: TyreScene },
  oil: {
    sound: 'drip',
    soundGapMs: 320,
    meter: 'おいる',
    toolAt: (request) => partPoint(request, OIL_CAN_OVER_ENGINE),
    drawsPart: false,
    Scene: EngineScene,
  },
};

interface HoldFixProps {
  request: RepairRequest;
  kind: HoldFixKind;
  onFinished: () => void;
}

/** ② for troubles fixed by holding one tool: the pump fills a flat tyre, the oil can feeds a smoking engine. */
export function HoldFix({ request, kind, onFinished }: HoldFixProps) {
  const sound = useSound();
  const showHint = useIdleHint();
  const { sound: workSound, soundGapMs, meter, toolAt, drawsPart, Scene } = DESIGNS[kind];
  const {
    items: [fill],
    heldIndex,
    handlersFor,
  } = useHoldProgress({ count: 1, holdMs: FIX_HOLD_MS, sound: workSound, soundGapMs, onDone: () => sound.play('sparkle') });

  useTimeout(onFinished, FINISH_PAUSE_MS, fill.isDone);

  const tool = toolAt(request);
  const isWorking = heldIndex !== undefined;
  const state = fill.isDone ? 'done' : isWorking ? 'working' : 'waiting';

  return (
    <div className={`hold-fix hold-fix--${kind} hold-fix--${state}`} style={HOLD_STYLE}>
      <WorkbenchVehicleArt
        vehicle={request.vehicle}
        expression={fill.isDone ? 'happy' : 'sad'}
        hiddenPart={drawsPart ? request.partId : undefined}
      />
      <Scene request={request} tool={tool} isWorking={isWorking} isDone={fill.isDone} />
      <button
        type="button"
        className="tool-button hold-tool"
        style={{ left: tool.x, top: tool.y }}
        aria-label={request.tool.name}
        disabled={fill.isDone}
        {...handlersFor(0)}
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
