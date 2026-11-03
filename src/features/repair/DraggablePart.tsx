import { useRef, useState, type PointerEvent } from 'react';
import { PartArt, type RepairRequest, slotOf } from '@/features/vehicles';
import { useSound } from '@/shared/sound';
import { localPoint, STAGE_SIZE, type Point } from '@/shared/ui';
import { partBoxStyle } from './partBox';
import { createPartSnap } from './partSnap';

interface DraggablePartProps {
  request: RepairRequest;
  slot: Point;
  home: Point;
  /** How close a drop has to land, in stage coordinates. */
  radius: number;
  onSnapped: () => void;
}

/** The new part. Let go near its place and it clicks in; anywhere else, it glides home. */
export function DraggablePart({ request, slot, home, radius, onSnapped }: DraggablePartProps) {
  const sound = useSound();
  const [snap] = useState(() => createPartSnap({ slot, home, radius }));
  const [position, setPosition] = useState(home);
  const [isSnapped, setIsSnapped] = useState(false);
  const [grabOffset, setGrabOffset] = useState<Point>();
  const stageRef = useRef<Element>(null);

  const pointerPosition = (event: PointerEvent, offset: Point): Point => {
    const point = localPoint(event, stageRef.current ?? event.currentTarget, STAGE_SIZE.width);
    return { x: point.x + offset.x, y: point.y + offset.y };
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    stageRef.current = event.currentTarget.closest('[data-screen]');
    const point = pointerPosition(event, { x: 0, y: 0 });
    setGrabOffset({ x: position.x - point.x, y: position.y - point.y });
  };

  const handlePointerMove = (event: PointerEvent) => {
    if (grabOffset) setPosition(pointerPosition(event, grabOffset));
  };

  const handlePointerUp = (event: PointerEvent) => {
    if (!grabOffset) return;
    const result = snap.drop(pointerPosition(event, grabOffset));
    setGrabOffset(undefined);
    setPosition(result.position);
    if (result.isSnapped) {
      setIsSnapped(true);
      sound.play('clunk');
      onSnapped();
    } else {
      sound.play('tap');
    }
  };

  const stateClass = isSnapped ? 'new-part--snapped' : grabOffset ? 'new-part--held' : 'new-part--waiting';

  return (
    <div
      className={`bench-part new-part ${stateClass}`}
      style={partBoxStyle(position)}
      data-testid="new-part"
      role="img"
      aria-label={`あたらしい ${request.part.name}`}
      onPointerDown={isSnapped ? undefined : handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        setGrabOffset(undefined);
        setPosition(home);
      }}
    >
      <PartArt part={request.part} slot={slotOf(request)} />
    </div>
  );
}
