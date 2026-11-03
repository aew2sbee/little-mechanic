import { describe, expect, it } from 'vitest';
import { createCleaningProgress } from './cleaningProgress';

describe('きれい度の計算', () => {
  it('7割きれいになったとき、おそうじが完了になる', () => {
    // Arrange
    const sut = createCleaningProgress({ threshold: 0.7 });

    // Act
    const result = sut.update(0.7);

    // Assert
    expect(result.isComplete).toBe(true);
  });

  it('7割未満のとき、おそうじは完了にならない', () => {
    // Arrange
    const sut = createCleaningProgress({ threshold: 0.7 });

    // Act
    const result = sut.update(0.699);

    // Assert
    expect(result.isComplete).toBe(false);
  });

  it('きれい度を更新したとき、完了までの進み具合がわかる', () => {
    // Arrange
    const sut = createCleaningProgress({ threshold: 0.8 });

    // Act
    const result = sut.update(0.4);

    // Assert
    expect(result.progress).toBe(0.5);
  });

  it('完了を超えてきれいになったとき、進み具合は1で止まる', () => {
    // Arrange
    const sut = createCleaningProgress({ threshold: 0.7 });

    // Act
    const result = sut.update(1);

    // Assert
    expect(result.progress).toBe(1);
  });
});
