export type StickerStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const STORAGE_KEY = 'stickers';

interface StickerBookOptions {
  /** Injected so tests need no real localStorage. */
  storage: StickerStorage;
  /** Every sticker that can be collected. */
  stickerIds: readonly string[];
}

export interface StickerBook {
  collected(): string[];
  has(id: string): boolean;
  collect(id: string): void;
  isParadeUnlocked(): boolean;
  reset(): void;
}

function load(storage: StickerStorage, stickerIds: readonly string[]): string[] {
  try {
    const saved: unknown = JSON.parse(storage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(saved) ? stickerIds.filter((id) => saved.includes(id)) : [];
  } catch {
    return [];
  }
}

/** Stickers stay in memory as well, so a child keeps them for now if saving ever fails. */
export function createStickerBook({ storage, stickerIds }: StickerBookOptions): StickerBook {
  let collected = load(storage, stickerIds);

  const save = () => {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(collected));
    } catch {
      // Storage full or blocked: the stickers last until the page closes.
    }
  };

  return {
    collected: () => [...collected],
    has: (id) => collected.includes(id),
    collect(id) {
      if (collected.includes(id)) return;
      collected = [...collected, id];
      save();
    },
    isParadeUnlocked: () => stickerIds.every((id) => collected.includes(id)),
    reset() {
      collected = [];
      try {
        storage.removeItem(STORAGE_KEY);
      } catch {
        // Nothing more can be done; memory is already empty.
      }
    },
  };
}
