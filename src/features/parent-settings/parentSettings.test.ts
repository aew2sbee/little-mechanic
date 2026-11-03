import { describe, expect, it } from 'vitest';
import { createParentSettings, type SettingsStorage } from './parentSettings';

function createFakeStorage(): SettingsStorage {
  const items = new Map<string, string>();
  return {
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => void items.set(key, value),
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
});
