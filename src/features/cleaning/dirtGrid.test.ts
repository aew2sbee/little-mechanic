import { describe, expect, it } from 'vitest';
import { createDirtGrid } from './dirtGrid';

const size = { width: 200, height: 200, cellSize: 10 };

describe('汚れの広がり', () => {
  it('何もしていないとき、きれい度は0になる', () => {
    // Arrange
    const sut = createDirtGrid({ ...size, spots: [{ x: 100, y: 100, r: 50 }] });

    // Act
    const result = sut.cleanRatio();

    // Assert
    expect(result).toBe(0);
  });

  it('汚れの全体をこすったとき、きれい度は1になる', () => {
    // Arrange
    const sut = createDirtGrid({ ...size, spots: [{ x: 100, y: 100, r: 50 }] });

    // Act
    const result = sut.wipe({ x: 100, y: 100 }, { x: 100, y: 100 }, 80);

    // Assert
    expect(result).toBe(1);
  });

  it('汚れのないところをこすったとき、きれい度は変わらない', () => {
    // Arrange
    const sut = createDirtGrid({ ...size, spots: [{ x: 50, y: 50, r: 20 }] });

    // Act
    const result = sut.wipe({ x: 170, y: 170 }, { x: 170, y: 170 }, 20);

    // Assert
    expect(result).toBe(0);
  });

  it('すばやくなぞって点と点が離れていたとき、あいだの汚れも落ちる', () => {
    // Arrange
    const sut = createDirtGrid({ ...size, spots: [{ x: 100, y: 100, r: 20 }] });

    // Act
    const result = sut.wipe({ x: 20, y: 100 }, { x: 180, y: 100 }, 25);

    // Assert
    expect(result).toBe(1);
  });

  it('同じところを2回こすったとき、きれい度は増えない', () => {
    // Arrange
    const sut = createDirtGrid({ ...size, spots: [{ x: 60, y: 100, r: 40 }, { x: 150, y: 100, r: 40 }] });
    const once = sut.wipe({ x: 60, y: 100 }, { x: 60, y: 100 }, 45);

    // Act
    const result = sut.wipe({ x: 60, y: 100 }, { x: 60, y: 100 }, 45);

    // Assert
    expect(result).toBe(once);
  });

  it('汚れが1つもないとき、きれい度は1になる', () => {
    // Arrange
    const sut = createDirtGrid({ ...size, spots: [] });

    // Act
    const result = sut.cleanRatio();

    // Assert
    expect(result).toBe(1);
  });
});
