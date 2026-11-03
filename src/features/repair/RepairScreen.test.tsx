import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { REPAIR_REQUESTS, slotOf, toWorkbench } from '@/features/vehicles';
import { RepairScreen } from './RepairScreen';

const request = REPAIR_REQUESTS.find((item) => item.id === 'police-tire')!;

const renderStage = (stage: 'trouble' | 'removal' | 'installation') => {
  const onPickTool = vi.fn();
  const onFinishStage = vi.fn();
  render(<RepairScreen request={request} stage={stage} onPickTool={onPickTool} onFinishStage={onFinishStage} />);
  return { onPickTool, onFinishStage };
};

const touchEveryScrew = () => {
  // Each pass touches the first screw still waiting, until none are left.
  for (let touches = 0; touches < 50; touches += 1) {
    const [screw] = screen.queryAllByRole('button', { name: 'ねじ' });
    if (!screw) return;
    fireEvent.pointerDown(screw);
  }
};

describe('①困った', () => {
  it('工具を押したとき、どの工具を選んだかが伝わる', async () => {
    // Arrange
    const user = userEvent.setup();
    const { onPickTool } = renderStage('trouble');

    // Act
    await user.click(screen.getByRole('button', { name: 'どりる' }));

    // Assert
    expect(onPickTool).toHaveBeenCalledWith('drill');
  });

  it('何も操作しないまま5秒たったとき、指のヒントが出る', () => {
    // Arrange
    vi.useFakeTimers();
    renderStage('trouble');

    // Act
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Assert
    expect(screen.getByRole('img', { name: 'ここを さわってね' })).toBeInTheDocument();
    vi.useRealTimers();
  });
});

describe('②取り外し', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('全部のねじを外したとき、②の完了が伝わる', () => {
    // Arrange
    const { onFinishStage } = renderStage('removal');
    touchEveryScrew();

    // Act
    act(() => {
      vi.runOnlyPendingTimers();
    });

    // Assert
    expect(onFinishStage).toHaveBeenCalledWith('removal');
  });

  it('ねじが残っているとき、②は完了にならない', () => {
    // Arrange
    const { onFinishStage } = renderStage('removal');

    // Act
    fireEvent.pointerDown(screen.getAllByRole('button', { name: 'ねじ' })[0]);
    act(() => {
      vi.advanceTimersByTime(4000);
    });

    // Assert
    expect(onFinishStage).not.toHaveBeenCalled();
  });
});

describe('③取り付け', () => {
  const dropPartAt = (point: { x: number; y: number }) => {
    const part = screen.getByTestId('new-part');
    fireEvent.pointerDown(part, { clientX: 640, clientY: 712 });
    fireEvent.pointerUp(part, { clientX: point.x, clientY: point.y });
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('部品を場所の近くで離したとき、ねじが現れる', () => {
    // Arrange
    renderStage('installation');

    // Act
    dropPartAt(toWorkbench(slotOf(request)));

    // Assert
    expect(screen.getAllByRole('button', { name: 'ねじ' })).toHaveLength(request.screws.length);
  });

  it('部品を場所から遠くで離したとき、ねじは現れない', () => {
    // Arrange
    renderStage('installation');

    // Act
    dropPartAt({ x: 100, y: 100 });

    // Assert
    expect(screen.queryByRole('button', { name: 'ねじ' })).not.toBeInTheDocument();
  });

  it('部品をはめて全部のねじを締めたとき、③の完了が伝わる', () => {
    // Arrange
    const { onFinishStage } = renderStage('installation');
    dropPartAt(toWorkbench(slotOf(request)));
    touchEveryScrew();

    // Act
    act(() => {
      vi.runOnlyPendingTimers();
    });

    // Assert
    expect(onFinishStage).toHaveBeenCalledWith('installation');
  });
});
