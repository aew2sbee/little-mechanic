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

export const TOOLS = {
  wrench: {
    name: 'れんち',
    shapes: [
      {
        kind: 'path',
        d: 'M-12 56 V-16 Q-34 -26 -32 -46 Q-30 -56 -22 -60 V-38 H-6 V-58 Q14 -62 22 -46 Q30 -26 12 -16 V56 Q0 66 -12 56 Z',
        fill: METAL,
      },
    ],
  },
  screwdriver: {
    name: 'どらいばー',
    shapes: [
      { kind: 'path', d: 'M-6 6 V-46 L-3 -60 H3 L6 -46 V6 Z', fill: METAL },
      { kind: 'rect', x: -19, y: 2, w: 38, h: 56, r: 14, fill: '#f0453c' },
      { kind: 'rect', x: -6, y: 12, w: 12, h: 36, r: 6, fill: '#ffb4a8' },
    ],
  },
  pliers: {
    name: 'ぺんち',
    shapes: [
      { kind: 'path', d: 'M-4 -6 L-32 54 L-16 60 L12 2 Z', fill: '#3f8fd8' },
      { kind: 'path', d: 'M4 -6 L32 54 L16 60 L-12 2 Z', fill: '#3f8fd8' },
      { kind: 'path', d: 'M-20 -8 L-14 -60 L-3 -60 L4 2 Z', fill: METAL },
      { kind: 'path', d: 'M20 -8 L14 -60 L3 -60 L-4 2 Z', fill: METAL },
      { kind: 'circle', x: 0, y: -4, r: 8, fill: DARK },
    ],
  },
  drill: {
    name: 'どりる',
    shapes: [
      { kind: 'rect', x: 42, y: -24, w: 24, h: 7, r: 2, fill: METAL },
      { kind: 'path', d: 'M26 -36 L46 -28 V-14 L26 -6 Z', fill: DARK },
      { kind: 'path', d: 'M-24 2 L-38 54 H-6 L6 2 Z', fill: '#f0a13c' },
      { kind: 'rect', x: -52, y: -40, w: 80, h: 44, r: 14, fill: '#f0a13c' },
      { kind: 'rect', x: -38, y: -28, w: 34, h: 8, r: 4, fill: '#ffd79a' },
    ],
  },
} satisfies Record<string, Tool>;

export type ToolId = keyof typeof TOOLS;

/** Badges that say what is wrong, drawn within a 40 × 40 box around (0, 0). */
export const TROUBLE_ICONS = {
  crack: [{ kind: 'path', d: 'M4 -17 L-11 3 H-1 L-5 17 L11 -5 H1 Z', fill: '#fff' }],
  smoke: [
    {
      kind: 'path',
      d: 'M-12 10 A8 8 0 0 1 -12 -6 A9 9 0 0 1 4 -11 A8 8 0 0 1 13 -1 A6 6 0 0 1 11 10 Z',
      fill: '#fff',
    },
  ],
  flat: [
    { kind: 'path', d: 'M-6 -17 H6 V-6 H13 L0 6 L-13 -6 H-6 Z', fill: '#fff' },
    { kind: 'rect', x: -16, y: 10, w: 32, h: 7, r: 3, fill: '#fff' },
  ],
  loose: [
    { kind: 'path', d: 'M-2 -2 L4 2 L-8 18 L-14 14 Z', fill: '#fff' },
    { kind: 'circle', x: 4, y: -6, r: 9, fill: '#fff' },
    { kind: 'path', d: 'M13 -17 Q19 -10 15 -2 M18 4 Q16 10 10 12', fill: 'none' },
  ],
} satisfies Record<string, Shape[]>;

export type TroubleIconId = keyof typeof TROUBLE_ICONS;

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

/** A patch of dirt on a vehicle, in the vehicle's coordinates. */
export interface DirtSpot extends Point {
  r: number;
}

export interface RepairRequest {
  id: string;
  vehicle: Vehicle;
  partId: PartId;
  part: Part;
  toolId: ToolId;
  tool: Tool;
  /** Relative to the middle of the part, in the part's own size. */
  screws: Point[];
  dirt: DirtSpot[];
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
