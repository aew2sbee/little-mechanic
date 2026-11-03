import { describe, expect, it } from 'vitest';
import { createHoldProgress } from './holdProgress';

describe('長押しの進み具合（ねじ・空気・オイル）', () => {
  it('決まった時間長押ししたとき、終わる', () => {
    // Arrange
    const sut = createHoldProgress({ holdMs: 1000 });

    // Act
    const result = sut.hold(1000);

    // Assert
    expect(result.isDone).toBe(true);
  });

  it('長押しが足りないとき、終わらない', () => {
    // Arrange
    const sut = createHoldProgress({ holdMs: 1000 });

    // Act
    const result = sut.hold(999);

    // Assert
    expect(result.isDone).toBe(false);
  });

  it('長押しした分だけ、進み具合が増える', () => {
    // Arrange
    const sut = createHoldProgress({ holdMs: 1000 });

    // Act
    const result = sut.hold(250);

    // Assert
    expect(result.progress).toBe(0.25);
  });

  it('途中で指を離して押し直したとき、続きから進んで終わる', () => {
    // Arrange
    const sut = createHoldProgress({ holdMs: 1000 }).hold(600);

    // Act
    const result = sut.hold(400);

    // Assert
    expect(result.isDone).toBe(true);
  });

  it('途中で指を離したとき、残りの時間は減ったままになる', () => {
    // Arrange
    const sut = createHoldProgress({ holdMs: 1000 });

    // Act
    const result = sut.hold(600);

    // Assert
    expect(result.remainingMs).toBe(400);
  });

  it('終わったあとに長押ししたとき、それ以上は進まない', () => {
    // Arrange
    const sut = createHoldProgress({ holdMs: 1000 }).hold(1000);

    // Act
    const result = sut.hold(500);

    // Assert
    expect(result.heldMs).toBe(1000);
  });
});
