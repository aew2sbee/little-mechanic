import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTimeout } from './timers';

describe('useTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('決まった時間がたったとき、1回だけ呼ばれる', () => {
    // Arrange
    const sut = useTimeout;
    const callback = vi.fn();
    renderHook(() => sut(callback, 800));

    // Act
    act(() => {
      vi.advanceTimersByTime(800 * 3);
    });

    // Assert
    expect(callback).toHaveBeenCalledOnce();
  });

  it('まだ始めていないとき、時間がたっても呼ばれない', () => {
    // Arrange
    const sut = useTimeout;
    const callback = vi.fn();
    renderHook(() => sut(callback, 800, false));

    // Act
    act(() => {
      vi.advanceTimersByTime(800);
    });

    // Assert
    expect(callback).not.toHaveBeenCalled();
  });

  it('時間になる前に画面を離れたとき、呼ばれない', () => {
    // Arrange
    const sut = useTimeout;
    const callback = vi.fn();
    const { unmount } = renderHook(() => sut(callback, 800));
    unmount();

    // Act
    act(() => {
      vi.advanceTimersByTime(800);
    });

    // Assert
    expect(callback).not.toHaveBeenCalled();
  });

  it('待っている間にコールバックが変わったとき、新しいほうが呼ばれる', () => {
    // Arrange
    const sut = useTimeout;
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(({ callback }) => sut(callback, 800), { initialProps: { callback: first } });
    rerender({ callback: second });

    // Act
    act(() => {
      vi.advanceTimersByTime(800);
    });

    // Assert
    expect([first.mock.calls.length, second.mock.calls.length]).toEqual([0, 1]);
  });
});
