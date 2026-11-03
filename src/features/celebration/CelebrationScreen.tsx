import { useEffect, useState, type CSSProperties } from 'react';
import { StickerArt } from '@/features/stickers';
import { VehicleArt, type RepairRequest } from '@/features/vehicles';
import { FingerHint, useIdleHint } from '@/shared/hint';
import { useSound } from '@/shared/sound';
import { ArrowIcon, IconButton, useTimeout } from '@/shared/ui';
import { RoadScene } from './RoadScene';

/** The run across the road ends here; the sticker and the way back appear after it. */
export const RUN_MS = 3200;
const RUN_STYLE = { '--run-duration': `${RUN_MS}ms` } as CSSProperties;
const NEXT_BUTTON = { x: 1160, y: 680 };

interface CelebrationScreenProps {
  request: RepairRequest;
  onComplete: () => void;
}

/** ③ The vehicle runs happily, and the child gets a sticker. */
export function CelebrationScreen({ request, onComplete }: CelebrationScreenProps) {
  const sound = useSound();
  const [hasRun, setHasRun] = useState(false);
  const showHint = useIdleHint(hasRun);

  useEffect(() => {
    sound.play('vroom');
  }, [sound]);

  useTimeout(() => {
    setHasRun(true);
    sound.play('fanfare');
  }, RUN_MS);

  return (
    <div className="screen" data-screen="celebration">
      <RoadScene>
        <VehicleArt className="run-car" vehicle={request.vehicle} style={RUN_STYLE} />
        {hasRun && (
          <>
            <p className="cheer">げんきに なったよ！</p>
            <div className="sticker-prize" role="img" aria-label={`${request.vehicle.name}の しーる`}>
              <StickerArt request={request} />
            </div>
            <div className="next-button" style={{ left: NEXT_BUTTON.x, top: NEXT_BUTTON.y }}>
              <IconButton label="つぎへ" onClick={onComplete}>
                <ArrowIcon />
              </IconButton>
            </div>
            {showHint && <FingerHint at={NEXT_BUTTON} />}
          </>
        )}
      </RoadScene>
    </div>
  );
}
