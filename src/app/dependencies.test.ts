import { describe, expect, it } from 'vitest';
import { createPrefixedStorage, type AppStorage } from './dependencies';

function createFakeStorage(): AppStorage {
  const items = new Map<string, string>();
  return {
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => void items.set(key, value),
    removeItem: (key) => void items.delete(key),
  };
}

describe('保存先の分離', () => {
  it('公開先が違うとき、同じキーでも保存内容は混ざらない', () => {
    // Arrange
    const shared = createFakeStorage();
    const sut = createPrefixedStorage(() => shared, 'production:');
    const preview = createPrefixedStorage(() => shared, 'preview:');
    preview.setItem('stickers', '["a"]');

    // Act
    const result = sut.getItem('stickers');

    // Assert
    expect(result).toBeNull();
  });
});
