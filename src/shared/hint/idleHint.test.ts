import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createIdleHint } from './idleHint';

describe('5秒ヒント', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('5秒操作がないとき、ヒントが表示される', () => {
    // Arrange
    const onChange = vi.fn();
    const sut = createIdleHint({ timers: globalThis, onChange });
    sut.start();

    // Act
    vi.advanceTimersByTime(5000);

    // Assert
    expect(onChange).toHaveBeenLastCalledWith(true);
  });

  it('5秒たつ前のとき、ヒントは表示されない', () => {
    // Arrange
    const onChange = vi.fn();
    const sut = createIdleHint({ timers: globalThis, onChange });
    sut.start();

    // Act
    vi.advanceTimersByTime(4999);

    // Assert
    expect(onChange).not.toHaveBeenCalled();
  });

  it('ヒントが出ているときに触ると、ヒントが消える', () => {
    // Arrange
    const onChange = vi.fn();
    const sut = createIdleHint({ timers: globalThis, onChange });
    sut.start();
    vi.advanceTimersByTime(5000);

    // Act
    sut.touch();

    // Assert
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it('途中で触ったとき、そこから5秒たつまでヒントは表示されない', () => {
    // Arrange
    const onChange = vi.fn();
    const sut = createIdleHint({ timers: globalThis, onChange });
    sut.start();
    vi.advanceTimersByTime(4000);
    sut.touch();

    // Act
    vi.advanceTimersByTime(4999);

    // Assert
    expect(onChange).not.toHaveBeenCalled();
  });

  it('止めたあとのとき、ヒントは表示されない', () => {
    // Arrange
    const onChange = vi.fn();
    const sut = createIdleHint({ timers: globalThis, onChange });
    sut.start();
    sut.stop();

    // Act
    vi.advanceTimersByTime(5000);

    // Assert
    expect(onChange).not.toHaveBeenCalled();
  });
});
