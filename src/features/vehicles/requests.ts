import { FIXES, PARTS, TOOLS } from './catalog';
import type { FixKind, PartId, RepairRequest, Vehicle } from './catalog';
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

/** Each request names the part and how it is put right; the tool, badge and words come with the fix. */
function request(vehicle: Vehicle, partId: PartId, fix: FixKind): RepairRequest {
  const { toolId, icon, trouble } = FIXES[fix];
  const part = PARTS[partId];
  return {
    id: `${vehicle.id}-${partId}`,
    vehicle,
    partId,
    part,
    fix,
    toolId,
    tool: TOOLS[toolId],
    screws: SCREWS[partId],
    icon,
    trouble: trouble(part.name),
  };
}

export const REPAIR_REQUESTS: RepairRequest[] = [
  request(police, 'siren', 'replace'),
  request(police, 'tire', 'inflate'),
  request(taxi, 'mirror', 'replace'),
  request(taxi, 'light', 'replace'),
  request(ambulance, 'siren', 'replace'),
  request(ambulance, 'mirror', 'replace'),
  request(fireEngine, 'light', 'replace'),
  request(fireEngine, 'door', 'replace'),
  request(bus, 'door', 'replace'),
  request(bus, 'engine', 'oil'),
  request(truck, 'tire', 'inflate'),
  request(truck, 'muffler', 'replace'),
  request(dumpTruck, 'bumper', 'replace'),
  request(dumpTruck, 'light', 'replace'),
  request(mixer, 'tire', 'inflate'),
  request(mixer, 'engine', 'oil'),
  request(garbageTruck, 'door', 'replace'),
  request(garbageTruck, 'bumper', 'replace'),
  request(towTruck, 'muffler', 'replace'),
  request(towTruck, 'bumper', 'replace'),
];

/** Every vehicle once, for the parade. */
export const VEHICLES: Vehicle[] = [...new Set(REPAIR_REQUESTS.map((item) => item.vehicle))];
