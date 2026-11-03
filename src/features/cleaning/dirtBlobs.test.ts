import { describe, expect, it } from 'vitest';
import { dirtBlobs } from './dirtBlobs';

describe('泥の塊', () => {
  it('汚れの場所を1つ渡したとき、すべての塊がその場所のまわりにできる', () => {
    // Arrange
    const sut = dirtBlobs;
    const spot = { x: 300, y: 200, r: 50 };

    // Act
    const result = sut([spot]);

    // Assert
    const reach = Math.max(...result.map((blob) => Math.hypot(blob.x - spot.x, blob.y - spot.y) + blob.r));
    expect(result.length).toBeGreaterThan(0);
    expect(reach).toBeLessThanOrEqual(spot.r * 1.5);
  });

  it('同じ汚れを2回渡したとき、同じ塊になる', () => {
    // Arrange
    const sut = dirtBlobs;
    const spots = [
      { x: 120, y: 260, r: 60 },
      { x: 480, y: 200, r: 40 },
    ];
    const first = sut(spots);

    // Act
    const result = sut(spots);

    // Assert
    expect(result).toEqual(first);
  });
});
