export type SettingsStorage = Pick<Storage, 'getItem' | 'setItem'>;

interface ParentSettingsOptions {
  storage: SettingsStorage;
  storageKey?: string;
}

export interface ParentSettings {
  isSoundOn(): boolean;
  setSoundOn(isOn: boolean): void;
}

export function createParentSettings({ storage, storageKey = 'sound-off' }: ParentSettingsOptions): ParentSettings {
  const read = () => {
    try {
      return storage.getItem(storageKey) !== 'true';
    } catch {
      return true;
    }
  };

  let isSoundOn = read();

  return {
    isSoundOn: () => isSoundOn,
    setSoundOn(isOn) {
      isSoundOn = isOn;
      try {
        storage.setItem(storageKey, String(!isOn));
      } catch {
        // Storage full or blocked: the setting lasts until the page closes.
      }
    },
  };
}
