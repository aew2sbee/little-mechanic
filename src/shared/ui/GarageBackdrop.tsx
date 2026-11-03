import { STAGE_SIZE } from './point';
import './ui.css';

const DOORS = [60, 460, 860];
const SHUTTER_SLATS = Array.from({ length: 8 }, (_, index) => 96 + index * 56);
const FLOOR_TILES = Array.from({ length: 9 }, (_, index) => 80 + index * 140);

/** The workshop behind every repair screen. */
export function GarageBackdrop() {
  const { width, height } = STAGE_SIZE;
  return (
    <svg className="garage-backdrop" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <rect width={width} height={height} fill="#f9dfae" />
      <rect y="0" width={width} height="60" fill="#e9a65b" />
      {/* Roll-up doors, with daylight coming through. */}
      {DOORS.map((x) => (
        <g key={x}>
          <rect x={x} y="84" width="360" height="470" rx="10" fill="#bfe8f7" stroke="#b9794a" strokeWidth="10" />
          {SHUTTER_SLATS.map((y) => (
            <rect key={y} x={x + 8} y={y} width="344" height="20" fill="#fff" opacity="0.28" />
          ))}
        </g>
      ))}
      <rect y="560" width={width} height="240" fill="#a9b7c2" />
      <rect y="552" width={width} height="14" fill="#7f8e9c" />
      {FLOOR_TILES.map((x) => (
        <path key={x} d={`M${x} 566 L${(x - 640) * 1.5 + 640} 800`} stroke="#93a2af" strokeWidth="4" />
      ))}
      <path d="M0 668 H1280" stroke="#93a2af" strokeWidth="4" />
    </svg>
  );
}
