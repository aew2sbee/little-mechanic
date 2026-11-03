import { describe, expect, it } from 'vitest';
import { createStickerBook, type StickerStorage } from './stickerBook';

const stickerIds = ['a', 'b', 'c'];

function createFakeStorage(initial: Record<string, string> = {}): StickerStorage {
  const items = new Map(Object.entries(initial));
  return {
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => void items.set(key, value),
    removeItem: (key) => void items.delete(key),
  };
}

describe('シール帳', () => {
  it('何も保存されていないとき、シールは空になる', () => {
    // Arrange
    const storage = createFakeStorage();

    // Act
    const sut = createStickerBook({ storage, stickerIds });

    // Assert
    expect(sut.collected()).toEqual([]);
  });

  it('シールを集めたとき、新しいシール帳でも読み込める', () => {
    // Arrange
    const storage = createFakeStorage();
    const sut = createStickerBook({ storage, stickerIds });
    sut.collect('b');

    // Act
    const reloaded = createStickerBook({ storage, stickerIds });

    // Assert
    expect(reloaded.collected()).toEqual(['b']);
  });

  it('同じシールを2回集めたとき、1枚だけ残る', () => {
    // Arrange
    const sut = createStickerBook({ storage: createFakeStorage(), stickerIds });
    sut.collect('a');

    // Act
    sut.collect('a');

    // Assert
    expect(sut.collected()).toEqual(['a']);
  });

  it('全件そろう前のとき、パレードは解放されない', () => {
    // Arrange
    const sut = createStickerBook({ storage: createFakeStorage(), stickerIds });
    sut.collect('a');

    // Act
    sut.collect('b');

    // Assert
    expect(sut.isParadeUnlocked()).toBe(false);
  });

  it('全件そろったとき、パレードが解放される', () => {
    // Arrange
    const sut = createStickerBook({ storage: createFakeStorage(), stickerIds });
    sut.collect('a');
    sut.collect('b');

    // Act
    sut.collect('c');

    // Assert
    expect(sut.isParadeUnlocked()).toBe(true);
  });

  it('リセットしたとき、シールは空になる', () => {
    // Arrange
    const sut = createStickerBook({ storage: createFakeStorage(), stickerIds });
    sut.collect('a');

    // Act
    sut.reset();

    // Assert
    expect(sut.collected()).toEqual([]);
  });

  it('リセットしたとき、新しいシール帳でも空のままになる', () => {
    // Arrange
    const storage = createFakeStorage();
    const sut = createStickerBook({ storage, stickerIds });
    sut.collect('a');
    sut.reset();

    // Act
    const reloaded = createStickerBook({ storage, stickerIds });

    // Assert
    expect(reloaded.collected()).toEqual([]);
  });

  it('リセットしたとき、パレードは解放されていない状態に戻る', () => {
    // Arrange
    const sut = createStickerBook({ storage: createFakeStorage(), stickerIds: ['a'] });
    sut.collect('a');

    // Act
    sut.reset();

    // Assert
    expect(sut.isParadeUnlocked()).toBe(false);
  });

  it('保存されたデータが壊れているとき、空から始まる', () => {
    // Arrange
    const storage = createFakeStorage({ stickers: '{not json' });

    // Act
    const sut = createStickerBook({ storage, stickerIds, storageKey: 'stickers' });

    // Assert
    expect(sut.collected()).toEqual([]);
  });

  it('今はないシールが保存されていたとき、無視される', () => {
    // Arrange
    const storage = createFakeStorage({ stickers: '["a","gone"]' });

    // Act
    const sut = createStickerBook({ storage, stickerIds, storageKey: 'stickers' });

    // Assert
    expect(sut.collected()).toEqual(['a']);
  });

  it('保存に失敗するとき、遊んでいる間はシールが残る', () => {
    // Arrange
    const storage: StickerStorage = {
      ...createFakeStorage(),
      setItem: () => {
        throw new Error('full');
      },
    };
    const sut = createStickerBook({ storage, stickerIds });

    // Act
    sut.collect('a');

    // Assert
    expect(sut.collected()).toEqual(['a']);
  });
});
