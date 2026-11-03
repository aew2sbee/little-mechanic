import { useEffect, useRef, type PointerEvent } from 'react';
import { VEHICLE_VIEW, WORKBENCH_BOX, type DirtSpot } from '@/features/vehicles';
import { localPoint, type Point } from '@/shared/ui';

/** Canvas pixels per vehicle unit: enough to stay crisp on a high-density tablet. */
const RESOLUTION = 2;
const MUD = ['#7b5a3c', '#8d6a48', '#6a4c31'];

/** Mud is drawn as overlapping blobs. Positions are fixed so each vehicle gets dirty the same way. */
function paintDirt(context: CanvasRenderingContext2D, spots: DirtSpot[]) {
  spots.forEach((spot, spotIndex) => {
    for (let blob = 0; blob < 18; blob += 1) {
      const angle = blob * 2.4 + spotIndex;
      const distance = spot.r * (0.1 + (blob % 5) * 0.16);
      context.fillStyle = MUD[(blob + spotIndex) % MUD.length];
      context.beginPath();
      context.arc(
        spot.x + Math.cos(angle) * distance,
        spot.y + Math.sin(angle) * distance,
        spot.r * (0.26 + ((blob * 7) % 4) * 0.08),
        0,
        Math.PI * 2,
      );
      context.fill();
    }
  });
}

interface DirtCanvasProps {
  spots: DirtSpot[];
  /** Finger size, in vehicle units. */
  radius: number;
  isCleared: boolean;
  /** Reports each finger movement in vehicle units. */
  onWipe: (from: Point, to: Point) => void;
  onRelease: () => void;
}

/** The mud on the vehicle. Rubbing rubs it off here; how clean it is gets measured elsewhere. */
export function DirtCanvas({ spots, radius, isCleared, onWipe, onRelease }: DirtCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPointRef = useRef<Point>(undefined);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
    context.scale(RESOLUTION, RESOLUTION);
    paintDirt(context, spots);
    context.globalCompositeOperation = 'destination-out';
    context.lineCap = 'round';
    context.lineWidth = radius * 2;
  }, [spots, radius]);

  const wipe = (event: PointerEvent<HTMLCanvasElement>, from: Point | undefined) => {
    const point = localPoint(event, event.currentTarget, VEHICLE_VIEW.width);
    const start = from ?? point;
    const context = event.currentTarget.getContext('2d');
    if (context) {
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(point.x, point.y);
      context.stroke();
    }
    lastPointRef.current = point;
    onWipe(start, point);
  };

  const release = () => {
    lastPointRef.current = undefined;
    onRelease();
  };

  return (
    <canvas
      ref={canvasRef}
      className={isCleared ? 'dirt dirt--cleared' : 'dirt'}
      style={WORKBENCH_BOX}
      width={VEHICLE_VIEW.width * RESOLUTION}
      height={VEHICLE_VIEW.height * RESOLUTION}
      data-testid="dirt"
      aria-label="どろんこ"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture?.(event.pointerId);
        wipe(event, undefined);
      }}
      onPointerMove={(event) => {
        if (lastPointRef.current) wipe(event, lastPointRef.current);
      }}
      onPointerUp={release}
      onPointerCancel={release}
    />
  );
}
