import type { ReactNode } from 'react';
import { PartArt, slotOf, TroubleBadge, VehicleArt, type RepairRequest } from '@/features/vehicles';
import { FingerHint, useIdleHint } from '@/shared/hint';
import { useSound } from '@/shared/sound';
import { BookIcon, GarageBackdrop, IconButton } from '@/shared/ui';
import './garage.css';

const BAY_CENTRES = [240, 640, 1040];

interface GarageScreenProps {
  /** The vehicles waiting, in order. */
  requests: readonly RepairRequest[];
  onSelect: (request: RepairRequest) => void;
  onOpenStickers: () => void;
  /** The way into the parent settings, which the garage knows nothing about. */
  corner?: ReactNode;
}

export function GarageScreen({ requests, onSelect, onOpenStickers, corner }: GarageScreenProps) {
  const sound = useSound();
  const showHint = useIdleHint();

  return (
    <div className="screen" data-screen="garage">
      <GarageBackdrop />
      <h1 className="garage-sign">ちいさな しゅうりやさん</h1>
      {requests.map((request, index) => (
        <button
          key={request.id}
          type="button"
          className="bay"
          style={{ left: BAY_CENTRES[index] }}
          aria-label={`${request.vehicle.name}の ${request.part.name}を なおす`}
          onClick={() => {
            sound.play('tap');
            onSelect(request);
          }}
        >
          <span className="bay__bubble">
            <PartArt part={request.part} tint={slotOf(request).tint} isBroken viewSize={190} />
            <TroubleBadge icon={request.icon} className="bay__badge" />
          </span>
          <VehicleArt className="bay__car" vehicle={request.vehicle} expression="sad" brokenPart={request.partId} />
        </button>
      ))}
      <div className="garage-stickers">
        <IconButton label="しーる" showLabel onClick={onOpenStickers}>
          <BookIcon />
        </IconButton>
      </div>
      {corner}
      {showHint && <FingerHint at={{ x: BAY_CENTRES[0], y: 470 }} />}
    </div>
  );
}
