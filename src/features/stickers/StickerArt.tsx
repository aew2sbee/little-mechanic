import { PartArt, slotOf, VehicleArt, type RepairRequest } from '@/features/vehicles';
import './stickers.css';

/** The reward for one repair: the vehicle, cheerful again, with the part that was fixed. */
export function StickerArt({ request }: { request: RepairRequest }) {
  return (
    <span className="sticker" aria-hidden="true">
      <VehicleArt className="sticker__car" vehicle={request.vehicle} />
      <span className="sticker__part">
        <PartArt part={request.part} tint={slotOf(request).tint} viewSize={190} />
      </span>
    </span>
  );
}
