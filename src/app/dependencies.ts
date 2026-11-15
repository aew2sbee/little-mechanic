import { createSoundPlayer, type SoundPlayer } from '@/shared/sound';

export type AppStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

/** Everything from outside the app that its logic relies on. Tests pass stand-ins. */
export interface AppDependencies {
  random: () => number;
  storage: AppStorage;
  sound: SoundPlayer;
}

/**
 * GitHub Pages serves every project and PR preview from one origin, so they share a
 * localStorage. A prefix keeps production and each preview's progress apart.
 */
export function createPrefixedStorage(getStorage: () => AppStorage, prefix: string): AppStorage {
  return {
    getItem: (key) => getStorage().getItem(prefix + key),
    setItem: (key, value) => getStorage().setItem(prefix + key, value),
    removeItem: (key) => getStorage().removeItem(prefix + key),
  };
}

export function createBrowserDependencies(): AppDependencies {
  return {
    random: Math.random,
    // Read on each use: merely touching localStorage can throw when storage is blocked.
    storage: createPrefixedStorage(() => window.localStorage, `little-mechanic:${import.meta.env.BASE_URL}:`),
    sound: createSoundPlayer(),
  };
}
