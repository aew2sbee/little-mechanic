export type SettingsStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const STORAGE_KEY = 'sound-off';

interface ParentSettingsOptions {
  storage: SettingsStorage;
}

export interface ParentSettings {
  isSoundOn(): boolean;
  setSoundOn(isOn: boolean): void;
  /** Back to the defaults, as if the app had never been opened. */
  reset(): void;
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
    reset() {
      isSoundOn = true;
      try {
        storage.removeItem(STORAGE_KEY);
      } catch {
        // Nothing more can be done; memory is already back to the default.
      }
    },
  };
}
