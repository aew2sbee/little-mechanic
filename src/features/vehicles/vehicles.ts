import { DARK, GLASS, LAMP, METAL, type Vehicle } from './catalog';

// Every vehicle is drawn side-on in a 640 × 360 box, facing right, with wheels on y = 296.

const sedanShell = (paint: string, roof: string) =>
  [
    {
      kind: 'path',
      d: 'M36 296 V236 Q36 214 62 210 L176 200 L204 146 Q212 130 232 128 H398 Q416 128 428 142 L476 200 L566 214 Q604 222 604 262 V296 Z',
      fill: paint,
    },
    {
      kind: 'path',
      d: 'M204 146 Q212 130 232 128 H398 Q416 128 428 142 L476 200 H176 Z',
      fill: roof,
    },
    { kind: 'path', d: 'M222 198 L240 152 H316 V198 Z', fill: GLASS },
    { kind: 'path', d: 'M336 198 V152 H396 L436 198 Z', fill: GLASS },
  ] as const;

export const police: Vehicle = {
  id: 'police',
  name: 'ぱとかー',
  shapes: [
    ...sedanShell('#34384c', '#f7f5ef'),
    { kind: 'path', d: 'M176 200 H476 V270 H176 Z', fill: '#f7f5ef' },
    { kind: 'circle', x: 326, y: 238, r: 22, fill: '#f4c542' },
    { kind: 'rect', x: 576, y: 232, w: 28, h: 20, r: 8, fill: LAMP },
  ],
  wheels: [{ x: 134, y: 296 }],
  face: { x: 374, y: 170 },
  slots: {
    siren: { x: 316, y: 96 },
    tire: { x: 500, y: 296 },
  },
};

export const taxi: Vehicle = {
  id: 'taxi',
  name: 'たくしー',
  shapes: [
    { kind: 'rect', x: 280, y: 96, w: 72, h: 34, r: 8, fill: LAMP },
    ...sedanShell('#f6a23c', '#f6a23c'),
    { kind: 'rect', x: 40, y: 232, w: 560, h: 16, fill: '#3b4058' },
  ],
  wheels: [
    { x: 134, y: 296 },
    { x: 500, y: 296 },
  ],
  face: { x: 374, y: 170 },
  slots: {
    mirror: { x: 448, y: 176, scale: 0.8 },
    light: { x: 560, y: 252, scale: 0.8 },
  },
};

export const ambulance: Vehicle = {
  id: 'ambulance',
  name: 'きゅうきゅうしゃ',
  shapes: [
    {
      kind: 'path',
      d: 'M36 296 V104 Q36 84 58 84 H400 Q424 84 440 102 L512 186 L572 200 Q606 210 606 248 V296 Z',
      fill: '#fbfbf6',
    },
    { kind: 'rect', x: 38, y: 216, w: 566, h: 22, fill: '#e8483f' },
    { kind: 'path', d: 'M396 112 H420 L484 186 H396 Z', fill: GLASS },
    { kind: 'rect', x: 260, y: 112, w: 106, h: 74, r: 8, fill: GLASS },
    { kind: 'rect', x: 104, y: 134, w: 88, h: 26, r: 4, fill: '#e8483f' },
    { kind: 'rect', x: 135, y: 103, w: 26, h: 88, r: 4, fill: '#e8483f' },
    { kind: 'rect', x: 578, y: 242, w: 28, h: 20, r: 8, fill: LAMP },
  ],
  wheels: [
    { x: 150, y: 296 },
    { x: 500, y: 296 },
  ],
  face: { x: 430, y: 150 },
  slots: {
    siren: { x: 230, y: 50 },
    mirror: { x: 520, y: 150, scale: 0.8 },
  },
};

export const fireEngine: Vehicle = {
  id: 'fire-engine',
  name: 'しょうぼうしゃ',
  shapes: [
    { kind: 'rect', x: 44, y: 66, w: 20, h: 76, fill: METAL },
    { kind: 'rect', x: 372, y: 66, w: 20, h: 76, fill: METAL },
    { kind: 'rect', x: 30, y: 72, w: 380, h: 16, r: 6, fill: METAL },
    { kind: 'rect', x: 30, y: 104, w: 380, h: 16, r: 6, fill: METAL },
    ...[70, 120, 170, 220, 270, 320, 370].map(
      (x) => ({ kind: 'rect', x, y: 84, w: 12, h: 24, fill: METAL }) as const,
    ),
    { kind: 'rect', x: 30, y: 138, w: 396, h: 158, r: 14, fill: '#e2453c' },
    {
      kind: 'path',
      d: 'M424 296 V116 Q424 92 448 92 H516 Q536 92 548 110 L596 186 Q606 202 606 224 V296 Z',
      fill: '#e2453c',
    },
    { kind: 'path', d: 'M450 116 H514 L562 190 H450 Z', fill: GLASS },
    { kind: 'rect', x: 56, y: 156, w: 100, h: 60, r: 8, fill: '#c7342c' },
    { kind: 'rect', x: 178, y: 156, w: 100, h: 60, r: 8, fill: '#c7342c' },
    { kind: 'rect', x: 300, y: 156, w: 100, h: 60, r: 8, fill: '#c7342c' },
    { kind: 'rect', x: 32, y: 228, w: 392, h: 14, fill: '#fff6e4' },
  ],
  wheels: [
    { x: 132, y: 296 },
    { x: 340, y: 296 },
    { x: 530, y: 296 },
  ],
  face: { x: 496, y: 152 },
  slots: {
    door: { x: 486, y: 250, scale: 0.8, tint: '#ee6a5f' },
    light: { x: 584, y: 204, scale: 0.72 },
  },
};

export const bus: Vehicle = {
  id: 'bus',
  name: 'ばす',
  shapes: [
    { kind: 'rect', x: 28, y: 72, w: 584, h: 224, r: 28, fill: '#f6c945' },
    { kind: 'rect', x: 30, y: 216, w: 580, h: 18, fill: '#e4703a' },
    { kind: 'rect', x: 168, y: 98, w: 92, h: 84, r: 10, fill: GLASS },
    { kind: 'rect', x: 274, y: 98, w: 92, h: 84, r: 10, fill: GLASS },
    { kind: 'rect', x: 62, y: 98, w: 92, h: 84, r: 10, fill: GLASS },
    { kind: 'rect', x: 380, y: 98, w: 92, h: 84, r: 10, fill: GLASS },
    { kind: 'rect', x: 488, y: 98, w: 112, h: 102, r: 12, fill: GLASS },
    { kind: 'rect', x: 584, y: 246, w: 28, h: 20, r: 8, fill: LAMP },
  ],
  wheels: [
    { x: 244, y: 296 },
    { x: 530, y: 296 },
  ],
  face: { x: 544, y: 150 },
  slots: {
    door: { x: 396, y: 248, scale: 0.8, tint: '#f9dc85' },
    engine: { x: 106, y: 238, scale: 0.8 },
  },
};

const cabOver = (paint: string) =>
  [
    { kind: 'rect', x: 28, y: 258, w: 576, h: 24, r: 6, fill: DARK },
    {
      kind: 'path',
      d: 'M412 274 V118 Q412 98 432 98 H510 Q530 98 542 114 L596 186 Q606 198 606 216 V274 Z',
      fill: paint,
    },
    { kind: 'path', d: 'M436 122 H506 L552 186 H436 Z', fill: GLASS },
  ] as const;

export const truck: Vehicle = {
  id: 'truck',
  name: 'とらっく',
  shapes: [
    { kind: 'rect', x: 28, y: 84, w: 372, h: 180, r: 10, fill: '#f2efe6' },
    { kind: 'rect', x: 30, y: 192, w: 368, h: 26, fill: '#3f8fd8' },
    ...cabOver('#3f8fd8'),
    { kind: 'rect', x: 580, y: 226, w: 26, h: 20, r: 8, fill: LAMP },
  ],
  wheels: [{ x: 110, y: 296 }],
  face: { x: 484, y: 152 },
  slots: {
    tire: { x: 510, y: 296 },
    muffler: { x: 300, y: 300, scale: 0.8 },
  },
};

export const dumpTruck: Vehicle = {
  id: 'dump-truck',
  name: 'だんぷかー',
  shapes: [
    { kind: 'path', d: 'M26 106 H404 L384 256 H58 Z', fill: '#c89a4e' },
    { kind: 'path', d: 'M26 106 H404 L398 136 H34 Z', fill: '#e0b56c' },
    { kind: 'path', d: 'M120 136 L130 256 M220 136 V256 M312 136 L304 256', fill: 'none' },
    ...cabOver('#f4c542'),
  ],
  wheels: [
    { x: 120, y: 296 },
    { x: 280, y: 296 },
    { x: 500, y: 296 },
  ],
  face: { x: 484, y: 152 },
  slots: {
    bumper: { x: 556, y: 280, scale: 0.72 },
    light: { x: 572, y: 222, scale: 0.72 },
  },
};

export const mixer: Vehicle = {
  id: 'mixer',
  name: 'みきさーしゃ',
  shapes: [
    {
      kind: 'path',
      d: 'M168 176 Q168 96 228 84 L340 84 Q396 96 398 176 Q396 246 340 254 L228 254 Q168 246 168 176 Z',
      fill: '#ece6d6',
    },
    { kind: 'path', d: 'M212 88 L268 250 M268 84 L324 250 M324 84 L372 216', fill: 'none' },
    { kind: 'rect', x: 28, y: 186, w: 142, h: 76, r: 6, fill: '#7f8e9c' },
    ...cabOver('#5db36b'),
    { kind: 'rect', x: 580, y: 226, w: 26, h: 20, r: 8, fill: LAMP },
  ],
  wheels: [
    { x: 130, y: 296 },
    { x: 280, y: 296 },
  ],
  face: { x: 484, y: 152 },
  slots: {
    tire: { x: 510, y: 296 },
    engine: { x: 100, y: 158, scale: 0.8 },
  },
};

export const garbageTruck: Vehicle = {
  id: 'garbage-truck',
  name: 'ごみしゅうしゅうしゃ',
  shapes: [
    { kind: 'path', d: 'M30 262 V136 Q34 92 84 88 H396 Q404 88 404 98 V262 Z', fill: '#5db36b' },
    { kind: 'path', d: 'M30 262 V136 Q34 92 84 88 H120 V262 Z', fill: '#3e9150' },
    { kind: 'rect', x: 160, y: 120, w: 200, h: 16, r: 8, fill: '#8fd19b' },
    { kind: 'rect', x: 160, y: 156, w: 200, h: 16, r: 8, fill: '#8fd19b' },
    ...cabOver('#fbfbf6'),
    { kind: 'rect', x: 580, y: 226, w: 26, h: 20, r: 8, fill: LAMP },
  ],
  wheels: [
    { x: 132, y: 296 },
    { x: 500, y: 296 },
  ],
  face: { x: 484, y: 152 },
  slots: {
    door: { x: 470, y: 232, scale: 0.72, tint: '#e6e4da' },
    bumper: { x: 556, y: 280, scale: 0.72 },
  },
};

export const towTruck: Vehicle = {
  id: 'tow-truck',
  name: 'れっかーしゃ',
  shapes: [
    { kind: 'path', d: 'M102 214 L250 96 L276 124 L154 222 Z', fill: METAL },
    { kind: 'path', d: 'M112 200 V236 Q112 256 92 256 Q74 256 74 238', fill: 'none' },
    { kind: 'rect', x: 150, y: 206, w: 262, h: 62, r: 8, fill: '#f08a3c' },
    { kind: 'rect', x: 30, y: 206, w: 124, h: 22, r: 8, fill: '#d86f26' },
    ...cabOver('#f08a3c'),
    { kind: 'rect', x: 432, y: 74, w: 64, h: 26, r: 8, fill: LAMP },
  ],
  wheels: [
    { x: 196, y: 296 },
    { x: 500, y: 296 },
  ],
  face: { x: 484, y: 152 },
  slots: {
    muffler: { x: 340, y: 300, scale: 0.72 },
    bumper: { x: 556, y: 280, scale: 0.72 },
  },
};
