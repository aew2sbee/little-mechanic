import { describe, expect, it } from 'vitest';
import { createPartSnap } from './partSnap';

const slot = { x: 500, y: 300 };
const home = { x: 100, y: 700 };

describe('部品の吸着判定', () => {
  it('吸着範囲の内側で離したとき、部品がはまる', () => {
    // Arrange
    const sut = createPartSnap({ slot, home, radius: 100 });

    // Act
    const result = sut.drop({ x: 540, y: 330 });

    // Assert
    expect(result).toEqual({ isSnapped: true, position: slot });
  });

  it('吸着範囲のちょうど境目で離したとき、部品がはまる', () => {
    // Arrange
    const sut = createPartSnap({ slot, home, radius: 100 });

    // Act
    const result = sut.drop({ x: 600, y: 300 });

    // Assert
    expect(result.isSnapped).toBe(true);
  });

  it('吸着範囲の外側で離したとき、部品は元の位置に戻る', () => {
    // Arrange
    const sut = createPartSnap({ slot, home, radius: 100 });

    // Act
    const result = sut.drop({ x: 601, y: 300 });

    // Assert
    expect(result).toEqual({ isSnapped: false, position: home });
  });
});
