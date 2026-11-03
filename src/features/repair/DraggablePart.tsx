import { useState, type PointerEvent } from 'react';
import type { RepairRequest } from '@/features/vehicles';
import { useSound } from '@/shared/sound';
import { localPoint, STAGE_SIZE, type Point } from '@/shared/ui';
import { BenchPartArt, partBoxStyle } from './partBox';
import { createPartSnap } from './partSnap';

interface DraggablePartProps {
  request: RepairRequest;
  slot: Point;
  home: Point;
  /** How close a drop has to land, in stage coordinates. */
  radius: number;
  onSnapped: () => void;
}

interface Grab {
  /** The stage's box on screen, measured once when the finger lands. */
  stage: DOMRect;
  /** From the finger to the part's middle, so the part does not jump under the finger. */
  offset: Point;
}

/** The new part. Let go near its place and it clicks in; anywhere else, it glides home. */
export function DraggablePart({ request, slot, home, radius, onSnapped }: DraggablePartProps) {
  const sound = useSound();
  const [position, setPosition] = useState(home);
  const [isSnapped, setIsSnapped] = useState(false);
  const [grab, setGrab] = useState<Grab>();

  const pointerPosition = (event: PointerEvent, { stage, offset }: Grab): Point => {
    const point = localPoint(event, stage, STAGE_SIZE.width);
    return { x: point.x + offset.x, y: point.y + offset.y };
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    const stage = (event.currentTarget.closest('[data-screen]') ?? event.currentTarget).getBoundingClientRect();
    const point = localPoint(event, stage, STAGE_SIZE.width);
    setGrab({ stage, offset: { x: position.x - point.x, y: position.y - point.y } });
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (grab) setPosition(pointerPosition(event, grab));
  };

  const handlePointerUp = (event: PointerEvent) => {
    if (!grab) return;
    const result = createPartSnap({ slot, home, radius }).drop(pointerPosition(event, grab));
    setGrab(undefined);
    setPosition(result.position);
    if (result.isSnapped) {
      setIsSnapped(true);
      sound.play('clunk');
      onSnapped();
    } else {
      sound.play('tap');
    }
  };

  const stateClass = isSnapped ? 'new-part--snapped' : grab ? 'new-part--held' : 'new-part--waiting';

  return (
    <div
      className={`bench-part new-part ${stateClass}`}
      // The box stays at home and only `translate` moves, so dragging needs no layout.
      style={{ ...partBoxStyle(home), translate: `${position.x - home.x}px ${position.y - home.y}px` }}
      data-testid="new-part"
      role="img"
      aria-label={`あたらしい ${request.part.name}`}
      onPointerDown={isSnapped ? undefined : handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        setGrab(undefined);
        setPosition(home);
      }}
    >
      <BenchPartArt request={request} />
    </div>
  );
}
