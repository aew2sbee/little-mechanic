import { describe, expect, it } from 'vitest';
import { fitStage } from './stageFit';

const stage = { width: 1280, height: 800 };

describe('画面全体の拡大縮小', () => {
  it('同じ形の画面のとき、すき間なくぴったり収まる', () => {
    // Arrange
    const sut = fitStage;

    // Act
    const result = sut({ width: 640, height: 400 }, stage);

    // Assert
    expect(result).toEqual({ scale: 0.5, left: 0, top: 0 });
  });

  it('横に長い画面のとき、高さに合わせて左右に余白が出る', () => {
    // Arrange
    const sut = fitStage;

    // Act
    const result = sut({ width: 2000, height: 800 }, stage);

    // Assert
    expect(result).toEqual({ scale: 1, left: 360, top: 0 });
  });

  it('縦に長い画面のとき、幅に合わせて上下に余白が出る', () => {
    // Arrange
    const sut = fitStage;

    // Act
    const result = sut({ width: 1280, height: 1000 }, stage);

    // Assert
    expect(result).toEqual({ scale: 1, left: 0, top: 100 });
  });
});
