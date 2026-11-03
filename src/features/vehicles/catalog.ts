import type { Point } from '@/shared/ui';

/** Drawing primitives. Art is plain data so a new vehicle, part or tool needs no new code. */
export type Shape =
  | { kind: 'rect'; x: number; y: number; w: number; h: number; r?: number; fill: string }
  | { kind: 'circle'; x: number; y: number; r: number; fill: string }
  | { kind: 'path'; d: string; fill: string };

export const GLASS = '#c8eef8';
export const METAL = '#b8c0cc';
export const DARK = '#3b4058';
export const LAMP = '#ffe07a';
export const RUBBER = '#2f3040';
/** Used for parts painted the same colour as the vehicle: see `PartSlot.tint`. */
export const TINT = 'currentColor';

export interface Part {
  name: string;
  /** Drawn around (0, 0). */
  shapes: Shape[];
  /** Drawn over `shapes` while the part is broken. */
  damage: Shape[];
}

export interface Tool {
  name: string;
  /** Drawn upright around (0, 0), within about 60 units. */
  shapes: Shape[];
}

export const PARTS = {
  tire: {
    name: 'たいや',
    shapes: [
      { kind: 'circle', x: 0, y: 0, r: 46, fill: RUBBER },
      { kind: 'circle', x: 0, y: 0, r: 27, fill: METAL },
      { kind: 'circle', x: 0, y: 0, r: 9, fill: '#8d97a8' },
    ],
    damage: [
      { kind: 'path', d: 'M-44 22 Q-60 46 -36 48 H36 Q60 46 44 22 Z', fill: RUBBER },
      { kind: 'path', d: 'M-6 -24 L4 -12 L-4 -4 L6 8', fill: 'none' },
    ],
  },
  light: {
    name: 'らいと',
    shapes: [
      { kind: 'rect', x: -56, y: -24, w: 112, h: 48, r: 14, fill: METAL },
      { kind: 'circle', x: 0, y: 0, r: 20, fill: LAMP },
    ],
    damage: [{ kind: 'path', d: 'M-8 -18 L4 -6 L-6 2 L8 16', fill: 'none' }],
  },
  siren: {
    name: 'さいれん',
    shapes: [
      { kind: 'path', d: 'M-38 12 V-8 Q-38 -32 0 -32 Q38 -32 38 -8 V12 Z', fill: '#f0453c' },
      { kind: 'rect', x: -66, y: 10, w: 132, h: 26, r: 8, fill: METAL },
    ],
    damage: [{ kind: 'path', d: 'M-14 -30 L0 -16 L-10 -6 L6 10', fill: 'none' }],
  },
  mirror: {
    name: 'みらー',
    shapes: [
      { kind: 'rect', x: -52, y: 22, w: 100, h: 24, r: 8, fill: DARK },
      { kind: 'path', d: 'M-16 24 L-2 24 L20 -8 L8 -14 Z', fill: DARK },
      { kind: 'rect', x: -6, y: -44, w: 52, h: 38, r: 14, fill: GLASS },
    ],
    damage: [{ kind: 'path', d: 'M6 -42 L16 -30 L8 -22 L24 -8', fill: 'none' }],
  },
  bumper: {
    name: 'ばんぱー',
    shapes: [
      { kind: 'rect', x: -76, y: -20, w: 152, h: 40, r: 16, fill: METAL },
      { kind: 'rect', x: -60, y: -12, w: 120, h: 7, r: 3, fill: '#e4e8ee' },
    ],
    damage: [{ kind: 'path', d: 'M-22 -20 L-10 -6 L-20 4 L-6 20', fill: 'none' }],
  },
  muffler: {
    name: 'まふらー',
    shapes: [
      { kind: 'rect', x: -94, y: -8, w: 34, h: 16, r: 4, fill: DARK },
      { kind: 'rect', x: -66, y: -22, w: 132, h: 44, r: 20, fill: '#9aa3b2' },
    ],
    damage: [{ kind: 'path', d: 'M-8 -22 L4 -8 L-6 2 L8 22', fill: 'none' }],
  },
  door: {
    name: 'どあ',
    shapes: [
      { kind: 'rect', x: -64, y: -48, w: 128, h: 96, r: 10, fill: TINT },
      { kind: 'rect', x: -16, y: -8, w: 32, h: 12, r: 6, fill: METAL },
    ],
    damage: [{ kind: 'path', d: 'M-30 -48 L-16 -28 L-30 -14 L-14 12', fill: 'none' }],
  },
  engine: {
    name: 'えんじん',
    shapes: [
      { kind: 'rect', x: -68, y: -46, w: 136, h: 92, r: 12, fill: '#6d7890' },
      { kind: 'rect', x: -32, y: -34, w: 64, h: 18, r: 6, fill: '#f0a13c' },
      { kind: 'rect', x: -32, y: -8, w: 64, h: 8, r: 3, fill: '#c9cfd9' },
      { kind: 'rect', x: -32, y: 6, w: 64, h: 8, r: 3, fill: '#c9cfd9' },
      { kind: 'rect', x: -32, y: 20, w: 64, h: 8, r: 3, fill: '#c9cfd9' },
    ],
    damage: [{ kind: 'path', d: 'M-22 -46 L-8 -26 L-20 -12 L-4 16', fill: 'none' }],
  },
} satisfies Record<string, Part>;

export type PartId = keyof typeof PARTS;

/** Tools are drawn upright, working end at the top: the screwdriver bit sits at (0, -60). */
export const TOOLS = {
  driver: {
    name: 'でんどうどらいばー',
    shapes: [
      { kind: 'path', d: 'M-4 -34 V-50 L0 -60 L4 -50 V-34 Z', fill: METAL },
      { kind: 'rect', x: -12, y: -40, w: 24, h: 12, r: 4, fill: DARK },
      { kind: 'rect', x: -21, y: -30, w: 42, h: 90, r: 18, fill: '#ffc531' },
      { kind: 'rect', x: -21, y: 16, w: 42, h: 44, r: 18, fill: RUBBER },
      { kind: 'rect', x: -8, y: -18, w: 16, h: 22, r: 6, fill: '#f0453c' },
      { kind: 'path', d: 'M4 22 L-6 38 H1 L-3 52 L8 34 H1 Z', fill: LAMP },
    ],
  },
  pump: {
    name: 'くうきいれ',
    shapes: [
      { kind: 'path', d: 'M16 30 Q50 30 50 0 Q50 -22 34 -30', fill: 'none' },
      { kind: 'rect', x: -4, y: -50, w: 8, h: 32, fill: METAL },
      { kind: 'rect', x: -36, y: -60, w: 72, h: 14, r: 7, fill: DARK },
      { kind: 'rect', x: -18, y: -22, w: 36, h: 70, r: 10, fill: '#3f8fd8' },
      { kind: 'circle', x: 0, y: 4, r: 10, fill: '#fff' },
      { kind: 'rect', x: -42, y: 46, w: 84, h: 14, r: 6, fill: DARK },
    ],
  },
  oiler: {
    name: 'おいるさし',
    shapes: [
      { kind: 'path', d: 'M-2 -8 L-42 -56 L-50 -48 L-12 -2 Z', fill: METAL },
      { kind: 'path', d: 'M32 18 Q58 20 54 38 Q50 52 32 46', fill: 'none' },
      { kind: 'path', d: 'M-22 8 L-8 -14 H8 L22 8 Z', fill: '#49b06f' },
      { kind: 'rect', x: -34, y: 4, w: 68, h: 54, r: 16, fill: '#49b06f' },
      { kind: 'path', d: 'M0 16 C6 24 10 29 10 34 A10 10 0 0 1 -10 34 C-10 29 -6 24 0 16 Z', fill: LAMP },
    ],
  },
} satisfies Record<string, Tool>;

export type ToolId = keyof typeof TOOLS;

/** Badges that say what is wrong, drawn within a 40 × 40 box around (0, 0). */
export const TROUBLE_ICONS = {
  crack: [{ kind: 'path', d: 'M4 -17 L-11 3 H-1 L-5 17 L11 -5 H1 Z', fill: '#fff' }],
  flat: [
    { kind: 'path', d: 'M-6 -17 H6 V-6 H13 L0 6 L-13 -6 H-6 Z', fill: '#fff' },
    { kind: 'rect', x: -16, y: 10, w: 32, h: 7, r: 3, fill: '#fff' },
  ],
  oil: [{ kind: 'path', d: 'M0 -17 C8 -6 13 1 13 6 A13 13 0 0 1 -13 6 C-13 1 -8 -6 0 -17 Z', fill: '#fff' }],
} satisfies Record<string, Shape[]>;

export type TroubleIconId = keyof typeof TROUBLE_ICONS;

/**
 * The ways a trouble is put right, each with its own tool and badge. `replace` swaps the
 * broken part, screws and all; `inflate` pumps up a flat tyre; `oil` feeds a smoking engine.
 */
export const FIXES = {
  replace: { toolId: 'driver', icon: 'crack' },
  inflate: { toolId: 'pump', icon: 'flat' },
  oil: { toolId: 'oiler', icon: 'oil' },
} as const satisfies Record<string, { toolId: ToolId; icon: TroubleIconId }>;

export type FixKind = keyof typeof FIXES;

export interface PartSlot extends Point {
  /** Size of the part on this vehicle. Defaults to 1. */
  scale?: number;
  /** Colour for parts painted to match the vehicle. */
  tint?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  shapes: Shape[];
  /** Wheels that are not repairable on this vehicle; a `tire` slot draws its own. */
  wheels: Point[];
  /** Middle of the eyes. */
  face: Point;
  /** Where each repairable part sits. Vehicles draw these parts themselves. */
  slots: Partial<Record<PartId, PartSlot>>;
}

export interface RepairRequest {
  id: string;
  vehicle: Vehicle;
  partId: PartId;
  part: Part;
  fix: FixKind;
  toolId: ToolId;
  tool: Tool;
  /** Relative to the middle of the part, in the part's own size. Used when the fix is `replace`. */
  screws: Point[];
  icon: TroubleIconId;
}

/** The size vehicles are drawn in. */
export const VEHICLE_VIEW = { width: 640, height: 360 } as const;

/** Where the vehicle sits during the repair steps, in stage coordinates. */
export const WORKBENCH = { x: 160, y: 110, scale: 1.5 } as const;

/** The same place as a style for an absolutely positioned drawing of the vehicle. */
export const WORKBENCH_BOX = {
  left: WORKBENCH.x,
  top: WORKBENCH.y,
  width: VEHICLE_VIEW.width * WORKBENCH.scale,
  height: VEHICLE_VIEW.height * WORKBENCH.scale,
} as const;

export function slotOf(request: Pick<RepairRequest, 'vehicle' | 'partId'>): PartSlot {
  const slot = request.vehicle.slots[request.partId];
  if (!slot) throw new Error(`${request.vehicle.id} has no slot for ${request.partId}`);
  return slot;
}

/** Converts a point on the vehicle to stage coordinates. */
export function toWorkbench(point: Point): Point {
  return { x: WORKBENCH.x + point.x * WORKBENCH.scale, y: WORKBENCH.y + point.y * WORKBENCH.scale };
}

/** Stage coordinates of a request's screws. */
export function screwPositions(request: RepairRequest): Point[] {
  const slot = slotOf(request);
  const scale = slot.scale ?? 1;
  return request.screws.map((screw) => toWorkbench({ x: slot.x + screw.x * scale, y: slot.y + screw.y * scale }));
}
