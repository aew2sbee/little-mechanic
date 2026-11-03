export type SettingsStorage = Pick<Storage, 'getItem' | 'setItem'>;

const STORAGE_KEY = 'sound-off';

interface ParentSettingsOptions {
  storage: SettingsStorage;
}

export interface ParentSettings {
  isSoundOn(): boolean;
  setSoundOn(isOn: boolean): void;
}

export function createParentSettings({ storage }: ParentSettingsOptions): ParentSettings {
  const read = () => {
    try {
      return storage.getItem(STORAGE_KEY) !== 'true';
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
        storage.setItem(STORAGE_KEY, String(!isOn));
      } catch {
        // Storage full or blocked: the setting lasts until the page closes.
      }
    },
  };
}
