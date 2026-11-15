import { describe, expect, it } from 'vitest';
import { createParentSettings, type SettingsStorage } from './parentSettings';

function createFakeStorage(): SettingsStorage {
  const items = new Map<string, string>();
  return {
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => void items.set(key, value),
    removeItem: (key) => void items.delete(key),
  };
}

describe('保護者設定の保存', () => {
  it('何も保存されていないとき、音はオンになる', () => {
    // Arrange
    const storage = createFakeStorage();

    // Act
    const sut = createParentSettings({ storage });

    // Assert
    expect(sut.isSoundOn()).toBe(true);
  });

  it('音をオフにしたとき、新しく読み込んでもオフのままになる', () => {
    // Arrange
    const storage = createFakeStorage();
    createParentSettings({ storage }).setSoundOn(false);

    // Act
    const sut = createParentSettings({ storage });

    // Assert
    expect(sut.isSoundOn()).toBe(false);
  });

  it('音をオフにしてからリセットしたとき、音はオンに戻る', () => {
    // Arrange
    const sut = createParentSettings({ storage: createFakeStorage() });
    sut.setSoundOn(false);

    // Act
    sut.reset();

    // Assert
    expect(sut.isSoundOn()).toBe(true);
  });

  it('リセットしたとき、新しく読み込んでもオンのままになる', () => {
    // Arrange
    const storage = createFakeStorage();
    const settings = createParentSettings({ storage });
    settings.setSoundOn(false);
    settings.reset();

    // Act
    const sut = createParentSettings({ storage });

    // Assert
    expect(sut.isSoundOn()).toBe(true);
  });

  it('保存先が使えないときにリセットしても、音はオンに戻る', () => {
    // Arrange
    const storage: SettingsStorage = {
      ...createFakeStorage(),
      removeItem: () => {
        throw new Error('blocked');
      },
    };
    const sut = createParentSettings({ storage });
    sut.setSoundOn(false);

    // Act
    sut.reset();

    // Assert
    expect(sut.isSoundOn()).toBe(true);
  });
});
