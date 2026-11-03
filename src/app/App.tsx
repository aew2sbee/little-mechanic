import { useCallback, useEffect, useState } from 'react';
import { ParadeScreen } from '@/features/celebration';
import { createRepairQueue, GarageScreen } from '@/features/garage';
import { createParentSettings, ParentSettingsGate, ParentSettingsScreen } from '@/features/parent-settings';
import { createStickerBook, StickerBookScreen } from '@/features/stickers';
import { REPAIR_REQUESTS, VEHICLES, type RepairRequest } from '@/features/vehicles';
import { SoundProvider } from '@/shared/sound';
import type { AppDependencies } from './dependencies';
import { RepairSession } from './RepairSession';
import { ScaledStage } from './ScaledStage';

type Screen =
  | { name: 'garage' }
  | { name: 'repair'; request: RepairRequest }
  | { name: 'stickers' }
  | { name: 'parade' }
  | { name: 'parent-settings' };

const GARAGE: Screen = { name: 'garage' };
const STICKER_IDS = REPAIR_REQUESTS.map((request) => request.id);

export function App({ dependencies }: { dependencies: AppDependencies }) {
  const { random, storage, sound } = dependencies;

  const [book] = useState(() => createStickerBook({ storage, stickerIds: STICKER_IDS }));
  const [settings] = useState(() => createParentSettings({ storage }));
  const [queue, setQueue] = useState(() =>
    createRepairQueue({ requests: REPAIR_REQUESTS, random, prefer: (request) => !book.has(request.id) }),
  );
  const [collected, setCollected] = useState(() => book.collected());
  const [isSoundOn, setIsSoundOn] = useState(() => settings.isSoundOn());
  const [screen, setScreen] = useState<Screen>(GARAGE);
  const [hasNewParade, setHasNewParade] = useState(false);

  useEffect(() => {
    sound.setMuted(!isSoundOn);
  }, [sound, isSoundOn]);

  const repairedRequest = screen.name === 'repair' ? screen.request : undefined;

  const handleRepaired = useCallback(() => {
    if (!repairedRequest) return;
    const wasUnlocked = book.isParadeUnlocked();
    book.collect(repairedRequest.id);
    setCollected(book.collected());
    setHasNewParade(!wasUnlocked && book.isParadeUnlocked());
  }, [book, repairedRequest]);

  const handleFinished = useCallback(() => {
    if (repairedRequest) setQueue((current) => current.complete(repairedRequest.id));
    setHasNewParade(false);
    setScreen(hasNewParade ? { name: 'parade' } : GARAGE);
  }, [repairedRequest, hasNewParade]);

  const handleLeave = useCallback(() => setScreen(GARAGE), []);

  return (
    <SoundProvider value={sound}>
      <ScaledStage>
        {screen.name === 'garage' && (
          <GarageScreen
            requests={queue.waiting}
            onSelect={(request) => setScreen({ name: 'repair', request })}
            onOpenStickers={() => setScreen({ name: 'stickers' })}
            corner={<ParentSettingsGate onOpen={() => setScreen({ name: 'parent-settings' })} />}
          />
        )}
        {screen.name === 'repair' && (
          <RepairSession
            key={screen.request.id}
            request={screen.request}
            onRepaired={handleRepaired}
            onFinished={handleFinished}
            onLeave={handleLeave}
          />
        )}
        {screen.name === 'stickers' && (
          <StickerBookScreen
            requests={REPAIR_REQUESTS}
            collected={collected}
            isParadeUnlocked={book.isParadeUnlocked()}
            onOpenParade={() => setScreen({ name: 'parade' })}
            onClose={handleLeave}
          />
        )}
        {screen.name === 'parade' && <ParadeScreen vehicles={VEHICLES} onClose={handleLeave} />}
        {screen.name === 'parent-settings' && (
          <ParentSettingsScreen
            isSoundOn={isSoundOn}
            onSoundChange={(isOn) => {
              settings.setSoundOn(isOn);
              setIsSoundOn(isOn);
            }}
            stickerCount={collected.length}
            stickerTotal={STICKER_IDS.length}
            onResetStickers={() => {
              book.reset();
              setCollected(book.collected());
            }}
            onClose={handleLeave}
          />
        )}
      </ScaledStage>
      <div className="rotate-prompt" aria-hidden="true">
        <svg viewBox="0 0 120 120" width="160" height="160">
          <rect x="24" y="30" width="72" height="60" rx="10" fill="#fff6e4" stroke="#2b2a3d" strokeWidth="6" />
          <path d="M16 20a50 50 0 0 1 40-12M56 8l-10-6M56 8l-8 9" fill="none" stroke="#2b2a3d" strokeWidth="6" strokeLinecap="round" />
        </svg>
        <p>よこに してね</p>
      </div>
    </SoundProvider>
  );
}
