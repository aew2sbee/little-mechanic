import { createContext, useContext } from 'react';
import type { SoundPlayer } from './soundPlayer';

const silentPlayer: SoundPlayer = {
  unlock() {},
  play() {},
  setMuted() {},
};

const SoundContext = createContext<SoundPlayer>(silentPlayer);

export const SoundProvider = SoundContext.Provider;

export function useSound(): SoundPlayer {
  return useContext(SoundContext);
}
