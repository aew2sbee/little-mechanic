import { describe, expect, it } from 'vitest';
import { createScrew } from './screw';

describe('ねじの取り外し', () => {
  it('決まった回数タッチしたとき、ねじが抜ける', () => {
    // Arrange
    const sut = createScrew({ action: 'remove', touchesNeeded: 3 }).touch().touch();

    // Act
    const result = sut.touch();

    // Assert
    expect(result.isDone).toBe(true);
  });

  it('タッチが足りないとき、ねじは抜けない', () => {
    // Arrange
    const sut = createScrew({ action: 'remove', touchesNeeded: 3 }).touch();

    // Act
    const result = sut.touch();

    // Assert
    expect(result.isDone).toBe(false);
  });

  it('タッチするたび、ねじが浮いてくる', () => {
    // Arrange
    const sut = createScrew({ action: 'remove', touchesNeeded: 4 });

    // Act
    const result = sut.touch();

    // Assert
    expect(result.lift).toBe(0.25);
  });
});

describe('ねじの締め付け', () => {
  it('決まった回数タッチしたとき、ねじが締まる', () => {
    // Arrange
    const sut = createScrew({ action: 'tighten', touchesNeeded: 3 }).touch().touch();

    // Act
    const result = sut.touch();

    // Assert
    expect(result.isDone).toBe(true);
  });

  it('タッチが足りないとき、ねじは締まらない', () => {
    // Arrange
    const sut = createScrew({ action: 'tighten', touchesNeeded: 3 }).touch();

    // Act
    const result = sut.touch();

    // Assert
    expect(result.isDone).toBe(false);
  });

  it('タッチするたび、ねじが沈んでいく', () => {
    // Arrange
    const sut = createScrew({ action: 'tighten', touchesNeeded: 4 });

    // Act
    const result = sut.touch();

    // Assert
    expect(result.lift).toBe(0.75);
  });

  it('締まったあとにタッチしたとき、回数はそれ以上増えない', () => {
    // Arrange
    const sut = createScrew({ action: 'tighten', touchesNeeded: 2 }).touch().touch();

    // Act
    const result = sut.touch();

    // Assert
    expect(result.touches).toBe(2);
  });
});
