import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createLongPress } from './longPress';

describe('保護者設定の長押し', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('3秒長押ししたとき、開く', () => {
    // Arrange
    const onLongPress = vi.fn();
    const sut = createLongPress({ timers: globalThis, onLongPress });
    sut.press();

    // Act
    vi.advanceTimersByTime(3000);

    // Assert
    expect(onLongPress).toHaveBeenCalledOnce();
  });

  it('短く押しただけのとき、開かない', () => {
    // Arrange
    const onLongPress = vi.fn();
    const sut = createLongPress({ timers: globalThis, onLongPress });
    sut.press();
    vi.advanceTimersByTime(2999);
    sut.release();

    // Act
    vi.advanceTimersByTime(1000);

    // Assert
    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('何度も短く押したとき、押した時間は積み重ならない', () => {
    // Arrange
    const onLongPress = vi.fn();
    const sut = createLongPress({ timers: globalThis, onLongPress });
    sut.press();
    vi.advanceTimersByTime(2000);
    sut.release();
    sut.press();

    // Act
    vi.advanceTimersByTime(2000);

    // Assert
    expect(onLongPress).not.toHaveBeenCalled();
  });

  it('押している途中で2本目の指が触れたとき、時間はやり直しにならない', () => {
    // Arrange
    const onLongPress = vi.fn();
    const sut = createLongPress({ timers: globalThis, onLongPress });
    sut.press();
    vi.advanceTimersByTime(2000);
    sut.press();

    // Act
    vi.advanceTimersByTime(1000);

    // Assert
    expect(onLongPress).toHaveBeenCalledOnce();
  });
});
