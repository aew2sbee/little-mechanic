import { useEffect, useRef, type PointerEvent } from 'react';
import { VEHICLE_VIEW, WORKBENCH_BOX } from '@/features/vehicles';
import { localPoint, type Point } from '@/shared/ui';
import type { DirtBlob } from './dirtBlobs';

/** Canvas pixels per vehicle unit: enough to stay crisp on a high-density tablet. */
const RESOLUTION = 2;
const MUD = ['#7b5a3c', '#8d6a48', '#6a4c31'];

function paintDirt(context: CanvasRenderingContext2D, blobs: readonly DirtBlob[]) {
  for (const blob of blobs) {
    context.fillStyle = MUD[blob.shade % MUD.length];
    context.beginPath();
    context.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
    context.fill();
  }
}

interface Stroke {
  /** The canvas's box on screen, measured once when the finger lands. */
  rect: DOMRect;
  last: Point;
}

interface DirtCanvasProps {
  blobs: readonly DirtBlob[];
  /** Finger size, in vehicle units. */
  radius: number;
  isCleared: boolean;
  /** Reports each finger movement in vehicle units. */
  onWipe: (from: Point, to: Point) => void;
  onRelease: () => void;
}

/** The mud on the vehicle. Rubbing rubs it off here; how clean it is gets measured elsewhere. */
export function DirtCanvas({ blobs, radius, isCleared, onWipe, onRelease }: DirtCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>(null);
  const strokeRef = useRef<Stroke>(undefined);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;
    context.scale(RESOLUTION, RESOLUTION);
    paintDirt(context, blobs);
    context.globalCompositeOperation = 'destination-out';
    context.lineCap = 'round';
    context.lineWidth = radius * 2;
    contextRef.current = context;
  }, [blobs, radius]);

  const wipe = (event: PointerEvent, rect: DOMRect, from: Point | undefined) => {
    const point = localPoint(event, rect, VEHICLE_VIEW.width);
    const start = from ?? point;
    const context = contextRef.current;
    if (context) {
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(point.x, point.y);
      context.stroke();
    }
    strokeRef.current = { rect, last: point };
    onWipe(start, point);
  };

  const release = () => {
    strokeRef.current = undefined;
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
        wipe(event, event.currentTarget.getBoundingClientRect(), undefined);
      }}
      onPointerMove={(event) => {
        const stroke = strokeRef.current;
        if (stroke) wipe(event, stroke.rect, stroke.last);
      }}
      onPointerUp={release}
      onPointerCancel={release}
    />
  );
}
