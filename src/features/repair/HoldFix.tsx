import type { ReactNode } from 'react';
import {
  inletPoint,
  slotOf,
  toWorkbench,
  ToolArt,
  WorkbenchVehicleArt,
  type FixKind,
  type RepairRequest,
} from '@/features/vehicles';
import { FingerHint, useIdleHint } from '@/shared/hint';
import type { SoundName } from '@/shared/sound';
import { StageBackdrop, type Point } from '@/shared/ui';
import { BenchPartArt, partBoxStyle } from './partBox';
import { useHoldProgress } from './useHoldProgress';

/** How long the tool needs holding until the tyre is full or the engine has its oil. */
export const FIX_HOLD_MS = 2400;

/** The pump stands on the floor to the right of the vehicle. */
const PUMP = { x: 1165, y: 640 };
/** Where the hose leaves the pump's drawing, from the middle of its button. */
const PUMP_HOSE_END = { x: 33, y: -29 };
/** The oil can hovers up and to the right of where the oil goes in, in stage units. */
const OIL_CAN_FROM_INLET = { x: 90, y: -150 };
/**
 * The spout once the can is tipped (`.hold-fix--oil.hold-fix--working .hold-tool svg` in
 * repair.css), from the middle of its button. The drops fall from here onto the inlet.
 */
const TIPPED_SPOUT = { x: -66, y: 14 };

const offset = (point: Point, by: Point): Point => ({ x: point.x + by.x, y: point.y + by.y });

interface SceneProps {
  request: RepairRequest;
  /** Middle of the tool's button. */
  tool: Point;
  isWorking: boolean;
  isDone: boolean;
}

/** A hose from the pump to the valve, and the tyre, which swells from flat to full as the CSS runs. */
function TyreScene({ request, tool }: SceneProps) {
  const start = offset(tool, PUMP_HOSE_END);
  const valve = inletPoint(request);
  const hose = `M${start.x} ${start.y} C${start.x + 37} ${start.y - 161} ${valve.x + 126} ${valve.y - 146} ${valve.x} ${valve.y}`;
  return (
    <>
      <StageBackdrop>
        {/* Outlined, so the hose still shows where it crosses a dark vehicle. */}
        <path className="pump-hose__outline" d={hose} />
        <path className="pump-hose__inner" d={hose} />
      </StageBackdrop>
      <div className="bench-part tyre" style={partBoxStyle(toWorkbench(slotOf(request)))}>
        <div className="tyre__flat">
          <BenchPartArt request={request} isBroken />
        </div>
        <div className="tyre__full">
          <BenchPartArt request={request} />
        </div>
      </div>
    </>
  );
}

/** Smoke rising from the engine, which the CSS clears as oil goes in, and drops while it pours. */
function EngineScene({ request, tool, isWorking, isDone }: SceneProps) {
  const inlet = inletPoint(request);
  const spout = offset(tool, TIPPED_SPOUT);
  return (
    <>
      {!isDone && (
        <div className="smoke" style={{ left: inlet.x, top: inlet.y }} aria-hidden="true">
          <span className="smoke__puff" />
          <span className="smoke__puff" />
          <span className="smoke__puff" />
        </div>
      )}
      {isWorking && (
        <div className="oil-drops" style={{ left: spout.x, top: spout.y }} aria-hidden="true">
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
  workSound: SoundName;
  soundGapMs: number;
  meter: string;
  toolAt: (request: RepairRequest) => Point;
  /** Leaves the part off the vehicle, because the scene draws it. */
  drawsPart: boolean;
  Scene: (props: SceneProps) => ReactNode;
}

const DESIGNS: Record<HoldFixKind, HoldFixDesign> = {
  inflate: { workSound: 'pump', soundGapMs: 300, meter: 'くうき', toolAt: () => PUMP, drawsPart: true, Scene: TyreScene },
  oil: {
    workSound: 'drip',
    soundGapMs: 320,
    meter: 'おいる',
    toolAt: (request) => offset(inletPoint(request), OIL_CAN_FROM_INLET),
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
  const showHint = useIdleHint();
  const { workSound, soundGapMs, meter, toolAt, drawsPart, Scene } = DESIGNS[kind];
  const {
    items: [fill],
    heldIndex,
    handlersFor,
    styleFor,
  } = useHoldProgress({ count: 1, holdMs: FIX_HOLD_MS, workSound, soundGapMs, onDone: onFinished });

  const tool = toolAt(request);
  const isWorking = heldIndex !== undefined;
  const state = fill.isDone ? 'done' : isWorking ? 'working' : 'waiting';

  return (
    <div className={`hold-fix hold-fix--${kind} hold-fix--${state}`} style={styleFor(0)}>
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
