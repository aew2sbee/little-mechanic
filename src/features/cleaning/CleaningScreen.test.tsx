import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { REPAIR_REQUESTS } from '@/features/vehicles';
import { CleaningScreen } from './CleaningScreen';

const request = REPAIR_REQUESTS[0];

/** Sweeps the finger across the whole vehicle, row by row. */
const rubEverywhere = () => {
  const dirt = screen.getByTestId('dirt');
  for (let y = 0; y <= 360; y += 60) {
    fireEvent.pointerDown(dirt, { clientX: 0, clientY: y });
    fireEvent.pointerMove(dirt, { clientX: 640, clientY: y });
    fireEvent.pointerUp(dirt, { clientX: 640, clientY: y });
  }
};

describe('④おそうじ', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // jsdom has no canvas; the drawing does not change what is measured.
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('始めたとき、きれいさのメーターは空になっている', () => {
    // Arrange
    const onComplete = vi.fn();

    // Act
    render(<CleaningScreen request={request} onComplete={onComplete} />);

    // Assert
    expect(screen.getByRole('progressbar', { name: 'きれいさ' })).toHaveAttribute('aria-valuenow', '0');
  });

  it('くるま全体をこすったとき、おそうじの完了が伝わる', () => {
    // Arrange
    const onComplete = vi.fn();
    render(<CleaningScreen request={request} onComplete={onComplete} />);
    rubEverywhere();

    // Act
    act(() => {
      vi.runOnlyPendingTimers();
    });

    // Assert
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('こすっていないとき、おそうじは完了にならない', () => {
    // Arrange
    const onComplete = vi.fn();
    render(<CleaningScreen request={request} onComplete={onComplete} />);

    // Act
    act(() => {
      vi.advanceTimersByTime(4000);
    });

    // Assert
    expect(onComplete).not.toHaveBeenCalled();
  });
});
