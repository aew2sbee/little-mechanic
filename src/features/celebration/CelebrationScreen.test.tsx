import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { REPAIR_REQUESTS, VEHICLES } from '@/features/vehicles';
import { CelebrationScreen, RUN_MS } from './CelebrationScreen';
import { ParadeScreen } from './ParadeScreen';

describe('③元気に走る演出', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('走っている途中のとき、つぎへのボタンは出ない', () => {
    // Arrange
    render(<CelebrationScreen request={REPAIR_REQUESTS[0]} onComplete={vi.fn()} />);

    // Act
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Assert
    expect(screen.queryByRole('button', { name: 'つぎへ' })).not.toBeInTheDocument();
  });

  it('走り終えたとき、シールが見える', () => {
    // Arrange
    render(<CelebrationScreen request={REPAIR_REQUESTS[0]} onComplete={vi.fn()} />);

    // Act
    act(() => {
      vi.advanceTimersByTime(RUN_MS);
    });

    // Assert
    expect(screen.getByRole('img', { name: 'ぱとかーの しーる' })).toBeInTheDocument();
  });

  it('つぎへを押したとき、演出の完了が伝わる', () => {
    // Arrange
    const onComplete = vi.fn();
    render(<CelebrationScreen request={REPAIR_REQUESTS[0]} onComplete={onComplete} />);
    act(() => {
      vi.advanceTimersByTime(RUN_MS);
    });

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'つぎへ' }));

    // Assert
    expect(onComplete).toHaveBeenCalledOnce();
  });
});

describe('パレード', () => {
  it('表示したとき、全部のくるまの絵が並ぶ', () => {
    // Arrange
    const vehicles = VEHICLES;

    // Act
    const { container } = render(<ParadeScreen vehicles={vehicles} onClose={vi.fn()} />);

    // Assert
    expect(container.querySelectorAll('.parade-car')).toHaveLength(vehicles.length);
  });
});
