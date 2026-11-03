import { memo, type CSSProperties } from 'react';
import {
  PARTS,
  TOOLS,
  TROUBLE_ICONS,
  VEHICLE_VIEW,
  WORKBENCH_BOX,
  type Part,
  type PartId,
  type PartSlot,
  type Shape,
  type Tool,
  type ToolId,
  type TroubleIconId,
  type Vehicle,
} from './catalog';
import './vehicles.css';

const INK = '#2b2a3d';

const outline = { stroke: INK, strokeWidth: 5, strokeLinejoin: 'round', strokeLinecap: 'round' } as const;

function Shapes({ shapes }: { shapes: readonly Shape[] }) {
  return shapes.map((shape, index) => {
    switch (shape.kind) {
      case 'rect':
        return <rect key={index} x={shape.x} y={shape.y} width={shape.w} height={shape.h} rx={shape.r} fill={shape.fill} />;
      case 'circle':
        return <circle key={index} cx={shape.x} cy={shape.y} r={shape.r} fill={shape.fill} />;
      case 'path':
        return <path key={index} d={shape.d} fill={shape.fill} />;
    }
  });
}

/** Broken parts lose their colour and gain a crack. */
function PartShapes({ part, isBroken = false }: { part: Part; isBroken?: boolean }) {
  return (
    <>
      <g style={isBroken ? { filter: 'saturate(0.35) brightness(0.85)' } : undefined}>
        <Shapes shapes={part.shapes} />
      </g>
      {isBroken && <Shapes shapes={part.damage} />}
    </>
  );
}

type Expression = 'sad' | 'happy';

function Face({ x, y, expression }: { x: number; y: number; expression: Expression }) {
  const isHappy = expression === 'happy';
  return (
    <g transform={`translate(${x} ${y})`}>
      {[-24, 24].map((eyeX) => (
        <g key={eyeX}>
          <circle cx={eyeX} cy={0} r={15} fill="#fff" />
          <circle cx={eyeX + 3} cy={isHappy ? -1 : 3} r={7} fill={INK} stroke="none" />
          <circle cx={eyeX + 5} cy={isHappy ? -3 : 1} r={2.5} fill="#fff" stroke="none" />
        </g>
      ))}
      {isHappy ? (
        <path d="M-16 20 Q0 40 16 20 Z" fill="#ff8a7a" />
      ) : (
        <>
          <path d="M-38 -18 Q-28 -22 -14 -28 M38 -18 Q28 -22 14 -28" fill="none" />
          <path d="M-14 32 Q0 20 14 32" fill="none" />
        </>
      )}
    </g>
  );
}

interface VehicleArtProps {
  vehicle: Vehicle;
  expression?: Expression;
  /** A part drawn broken. */
  brokenPart?: PartId;
  /** A part left off, usually because the screen draws it separately. */
  hiddenPart?: PartId;
  className?: string;
  style?: CSSProperties;
}

/** Memoised: screens re-render on every finger move, and a vehicle is dozens of shapes. */
export const VehicleArt = memo(function VehicleArt({
  vehicle,
  expression = 'happy',
  brokenPart,
  hiddenPart,
  className,
  style,
}: VehicleArtProps) {
  const slots = Object.entries(vehicle.slots) as [PartId, PartSlot][];
  return (
    <svg
      className={className}
      style={style}
      viewBox={`0 0 ${VEHICLE_VIEW.width} ${VEHICLE_VIEW.height}`}
      aria-hidden="true"
    >
      <g {...outline}>
        <Shapes shapes={vehicle.shapes} />
        {vehicle.wheels.map((wheel) => (
          <g key={wheel.x} transform={`translate(${wheel.x} ${wheel.y})`}>
            <PartShapes part={PARTS.tire} />
          </g>
        ))}
        {slots
          .filter(([partId]) => partId !== hiddenPart)
          .map(([partId, slot]) => (
            <g
              key={partId}
              transform={`translate(${slot.x} ${slot.y}) scale(${slot.scale ?? 1})`}
              style={{ color: slot.tint }}
            >
              <PartShapes part={PARTS[partId]} isBroken={partId === brokenPart} />
            </g>
          ))}
        <Face x={vehicle.face.x} y={vehicle.face.y} expression={expression} />
      </g>
    </svg>
  );
});

/** The vehicle on the workbench, where the repair steps draw over it. */
export function WorkbenchVehicleArt({ className, ...props }: Omit<VehicleArtProps, 'style'>) {
  return (
    <VehicleArt
      {...props}
      className={className ? `workbench-car ${className}` : 'workbench-car'}
      style={WORKBENCH_BOX}
    />
  );
}

interface PartArtProps {
  part: Part;
  /** The colour the part has on its vehicle, from `PartSlot.tint`. */
  tint?: string;
  /** Matches the part's size on the vehicle, from `PartSlot.scale`. Leave it out for a picture of the part. */
  scale?: number;
  isBroken?: boolean;
  /** Width of the square shown; smaller zooms in. Keep `PART_VIEW_SIZE` where sizes must match the vehicle. */
  viewSize?: number;
}

/** A part on its own, drawn at `PART_VIEW_SIZE` in a square centred on the part. */
export function PartArt({ part, tint, scale = 1, isBroken, viewSize = PART_VIEW_SIZE }: PartArtProps) {
  const half = viewSize / 2;
  return (
    <svg style={{ color: tint }} viewBox={`${-half} ${-half} ${viewSize} ${viewSize}`} aria-hidden="true">
      <g {...outline} transform={`scale(${scale})`}>
        <PartShapes part={part} isBroken={isBroken} />
      </g>
    </svg>
  );
}

export const PART_VIEW_SIZE = 240;

export function ToolArt({ tool, silhouette = false }: { tool: Tool; silhouette?: boolean }) {
  return (
    <svg viewBox="-72 -72 144 144" aria-hidden="true">
      <g {...outline} style={silhouette ? { filter: 'brightness(0) opacity(0.45)' } : undefined}>
        <Shapes shapes={tool.shapes} />
      </g>
    </svg>
  );
}

export function TroubleBadge({ icon, className }: { icon: TroubleIconId; className?: string }) {
  return (
    <svg className={className} viewBox="-26 -26 52 52" aria-hidden="true">
      <circle r={23} fill="#e8483f" stroke={INK} strokeWidth={4} />
      <g stroke={INK} strokeWidth={2} strokeLinejoin="round">
        <Shapes shapes={TROUBLE_ICONS[icon]} />
      </g>
    </svg>
  );
}

export const ALL_TOOLS = Object.entries(TOOLS) as [ToolId, Tool][];
