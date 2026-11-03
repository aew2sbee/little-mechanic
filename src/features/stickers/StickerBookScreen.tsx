import type { RepairRequest } from '@/features/vehicles';
import { useSound } from '@/shared/sound';
import { FlagIcon, HomeIcon, IconButton, LockIcon } from '@/shared/ui';
import { StickerArt } from './StickerArt';
import './stickers.css';

interface StickerBookScreenProps {
  requests: readonly RepairRequest[];
  collected: readonly string[];
  isParadeUnlocked: boolean;
  onOpenParade: () => void;
  onClose: () => void;
}

export function StickerBookScreen({
  requests,
  collected,
  isParadeUnlocked,
  onOpenParade,
  onClose,
}: StickerBookScreenProps) {
  const sound = useSound();

  return (
    <div className="screen sticker-book" data-screen="stickers">
      <ul className="sticker-book__grid" aria-label="しーるちょう">
        {requests.map((request) => {
          const isCollected = collected.includes(request.id);
          const name = `${request.vehicle.name}の ${request.part.name}`;
          return (
            <li
              key={request.id}
              className={isCollected ? 'sticker-slot sticker-slot--filled' : 'sticker-slot'}
              aria-label={isCollected ? `${name}の しーる` : 'まだ ない しーる'}
            >
              {isCollected ? <StickerArt request={request} /> : <span className="sticker-slot__mark">?</span>}
            </li>
          );
        })}
      </ul>
      <div className="sticker-book__side">
        <IconButton label="がれーじ" showLabel onClick={onClose}>
          <HomeIcon />
        </IconButton>
        {isParadeUnlocked ? (
          <IconButton label="ぱれーど" showLabel onClick={onOpenParade} className="sticker-book__parade">
            <FlagIcon />
          </IconButton>
        ) : (
          <button
            type="button"
            className="sticker-book__locked"
            aria-label="ぱれーどは まだ あそべない"
            onClick={() => sound.play('nope')}
          >
            <LockIcon />
          </button>
        )}
      </div>
    </div>
  );
}
