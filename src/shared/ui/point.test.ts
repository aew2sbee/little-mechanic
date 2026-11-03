import { describe, expect, it } from 'vitest';
import { localPoint } from './point';

describe('localPoint', () => {
  it('要素が半分に縮小されているとき、元の大きさの座標に戻る', () => {
    // Arrange
    const sut = localPoint;
    const element = { getBoundingClientRect: () => ({ left: 100, top: 50, width: 640 }) as DOMRect };

    // Act
    const result = sut({ clientX: 200, clientY: 150 }, element, 1280);

    // Assert
    expect(result).toEqual({ x: 200, y: 200 });
  });

  it('要素の幅が測れないとき、拡大率を1として扱う', () => {
    // Arrange
    const sut = localPoint;
    const element = { getBoundingClientRect: () => ({ left: 0, top: 0, width: 0 }) as DOMRect };

    // Act
    const result = sut({ clientX: 30, clientY: 40 }, element, 1280);

    // Assert
    expect(result).toEqual({ x: 30, y: 40 });
  });
});
