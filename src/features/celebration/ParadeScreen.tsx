import { useEffect } from 'react';
import { VehicleArt, type Vehicle } from '@/features/vehicles';
import { useSound } from '@/shared/sound';
import { HomeIcon, IconButton } from '@/shared/ui';
import { RoadScene } from './RoadScene';

/** Seconds between one vehicle entering the road and the next. */
const SPACING_S = 2.2;
/** Starts the animation part-way through, so the road is full from the first frame. */
const HEAD_START_S = 8;

interface ParadeScreenProps {
  vehicles: readonly Vehicle[];
  onClose: () => void;
}

/** The prize for a full sticker book: every vehicle on the road together. */
export function ParadeScreen({ vehicles, onClose }: ParadeScreenProps) {
  const sound = useSound();

  useEffect(() => {
    sound.play('fanfare');
  }, [sound]);

  return (
    <div className="screen" data-screen="parade">
      <RoadScene>
        <p className="cheer">ぱれーど！</p>
        {vehicles.map((vehicle, index) => (
          <VehicleArt
            key={vehicle.id}
            className="parade-car"
            vehicle={vehicle}
            style={{
              animationDuration: `${vehicles.length * SPACING_S}s`,
              animationDelay: `${index * SPACING_S - HEAD_START_S}s`,
            }}
          />
        ))}
        <div className="parade-home">
          <IconButton label="がれーじ" onClick={onClose}>
            <HomeIcon />
          </IconButton>
        </div>
      </RoadScene>
    </div>
  );
}
