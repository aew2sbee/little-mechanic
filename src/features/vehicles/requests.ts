import { PARTS, TOOLS } from './catalog';
import type { DirtSpot, PartId, RepairRequest, ToolId, TroubleIconId, Vehicle } from './catalog';
import {
  ambulance,
  bus,
  dumpTruck,
  fireEngine,
  garbageTruck,
  mixer,
  police,
  taxi,
  towTruck,
  truck,
} from './vehicles';

/** Each part is held on the same way wherever it is fitted. */
const SCREWS: Record<PartId, RepairRequest['screws']> = {
  tire: [
    { x: 0, y: -32 },
    { x: 28, y: 16 },
    { x: -28, y: 16 },
  ],
  light: [
    { x: -42, y: 0 },
    { x: 42, y: 0 },
  ],
  siren: [
    { x: -48, y: 23 },
    { x: 48, y: 23 },
  ],
  mirror: [
    { x: -36, y: 34 },
    { x: 30, y: 34 },
  ],
  bumper: [
    { x: -54, y: 0 },
    { x: 54, y: 0 },
  ],
  muffler: [
    { x: -40, y: 0 },
    { x: 40, y: 0 },
  ],
  door: [
    { x: -46, y: -32 },
    { x: 46, y: -32 },
    { x: -46, y: 32 },
    { x: 46, y: 32 },
  ],
  engine: [
    { x: -52, y: -32 },
    { x: 52, y: -32 },
    { x: -52, y: 32 },
    { x: 52, y: 32 },
  ],
};

/** Dirt for the two shapes of vehicle body. Requests pick which mud they get. */
const DIRT_LOW: DirtSpot[] = [
  { x: 120, y: 236, r: 70 },
  { x: 260, y: 246, r: 62 },
  { x: 390, y: 240, r: 66 },
  { x: 526, y: 244, r: 60 },
];
const DIRT_HIGH: DirtSpot[] = [
  { x: 130, y: 150, r: 60 },
  { x: 290, y: 136, r: 64 },
  { x: 440, y: 170, r: 56 },
  { x: 540, y: 240, r: 48 },
];
const DIRT_ALL_OVER: DirtSpot[] = [
  { x: 100, y: 190, r: 58 },
  { x: 230, y: 240, r: 58 },
  { x: 320, y: 150, r: 58 },
  { x: 450, y: 236, r: 58 },
  { x: 550, y: 190, r: 44 },
];

function request(
  vehicle: Vehicle,
  partId: PartId,
  toolId: ToolId,
  icon: TroubleIconId,
  dirt: DirtSpot[],
): RepairRequest {
  return {
    id: `${vehicle.id}-${partId}`,
    vehicle,
    partId,
    part: PARTS[partId],
    toolId,
    tool: TOOLS[toolId],
    screws: SCREWS[partId],
    dirt,
    icon,
  };
}

export const REPAIR_REQUESTS: RepairRequest[] = [
  request(police, 'siren', 'pliers', 'crack', DIRT_LOW),
  request(police, 'tire', 'wrench', 'flat', DIRT_ALL_OVER),
  request(taxi, 'mirror', 'screwdriver', 'loose', DIRT_ALL_OVER),
  request(taxi, 'light', 'screwdriver', 'crack', DIRT_LOW),
  request(ambulance, 'siren', 'pliers', 'crack', DIRT_HIGH),
  request(ambulance, 'mirror', 'screwdriver', 'loose', DIRT_LOW),
  request(fireEngine, 'light', 'screwdriver', 'crack', DIRT_ALL_OVER),
  request(fireEngine, 'door', 'drill', 'loose', DIRT_HIGH),
  request(bus, 'door', 'drill', 'loose', DIRT_HIGH),
  request(bus, 'engine', 'wrench', 'smoke', DIRT_ALL_OVER),
  request(truck, 'tire', 'wrench', 'flat', DIRT_HIGH),
  request(truck, 'muffler', 'wrench', 'smoke', DIRT_LOW),
  request(dumpTruck, 'bumper', 'drill', 'crack', DIRT_HIGH),
  request(dumpTruck, 'light', 'pliers', 'crack', DIRT_ALL_OVER),
  request(mixer, 'tire', 'wrench', 'flat', DIRT_ALL_OVER),
  request(mixer, 'engine', 'pliers', 'smoke', DIRT_LOW),
  request(garbageTruck, 'door', 'drill', 'loose', DIRT_ALL_OVER),
  request(garbageTruck, 'bumper', 'wrench', 'crack', DIRT_HIGH),
  request(towTruck, 'muffler', 'pliers', 'smoke', DIRT_HIGH),
  request(towTruck, 'bumper', 'drill', 'crack', DIRT_LOW),
];

/** Every vehicle once, for the parade. */
export const VEHICLES: Vehicle[] = [...new Set(REPAIR_REQUESTS.map((item) => item.vehicle))];
