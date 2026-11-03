import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { REPAIR_REQUESTS, slotOf, toWorkbench } from '@/features/vehicles';
import { FIX_HOLD_MS } from './HoldFix';
import { InstallationStep } from './InstallationStep';
import { PART_FALL_MS, RemovalStep } from './RemovalStep';
import { RepairScreen } from './RepairScreen';
import { SCREW_HOLD_MS } from './ScrewLayer';

const requestFor = (id: string) => REPAIR_REQUESTS.find((item) => item.id === id)!;
const brokenSiren = requestFor('police-siren');
const flatTyre = requestFor('police-tire');
const dryEngine = requestFor('bus-engine');

const screws = () => screen.queryAllByRole('button', { name: 'ねじ' });

const holdFor = (element: Element, ms: number) => {
  fireEvent.pointerDown(element);
  act(() => {
    vi.advanceTimersByTime(ms);
  });
};

const holdEveryScrew = () => {
  // Each pass holds the first screw still waiting, until none are left.
  for (let pass = 0; pass < 10 && screws().length > 0; pass += 1) {
    holdFor(screws()[0], SCREW_HOLD_MS);
  }
};

const dropPartAt = (point: { x: number; y: number }) => {
  const part = screen.getByTestId('new-part');
  fireEvent.pointerDown(part, { clientX: 640, clientY: 712 });
  fireEvent.pointerUp(part, { clientX: point.x, clientY: point.y });
};

const renderScreen = (request: typeof brokenSiren, stage: 'trouble' | 'fixing') => {
  const onPickTool = vi.fn();
  const onFinishStage = vi.fn();
  const sut = <RepairScreen request={request} stage={stage} onPickTool={onPickTool} onFinishStage={onFinishStage} />;
  render(sut);
  return { onPickTool, onFinishStage };
};

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('①困った', () => {
  it('工具を押したとき、どの工具を選んだかが伝わる', () => {
    // Arrange
    const { onPickTool } = renderScreen(flatTyre, 'trouble');

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'くうきいれ' }));

    // Assert
    expect(onPickTool).toHaveBeenCalledWith('pump');
  });

  it('何も操作しないまま5秒たったとき、指のヒントが出る', () => {
    // Arrange
    renderScreen(flatTyre, 'trouble');

    // Act
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Assert
    expect(screen.getByRole('img', { name: 'ここを さわってね' })).toBeInTheDocument();
  });
});

describe('②部品交換：ねじを外す', () => {
  const renderRemoval = () => {
    const onFinished = vi.fn();
    const sut = <RemovalStep request={brokenSiren} onFinished={onFinished} />;
    render(sut);
    return { onFinished };
  };

  it('全部のねじを決まった時間長押ししたとき、外し終わりが伝わる', () => {
    // Arrange
    const { onFinished } = renderRemoval();
    holdEveryScrew();

    // Act
    act(() => {
      vi.advanceTimersByTime(PART_FALL_MS);
    });

    // Assert
    expect(onFinished).toHaveBeenCalledOnce();
  });

  it('ねじを短く押して離したとき、時間がたってもねじは外れない', () => {
    // Arrange
    renderRemoval();
    const [screw] = screws();
    holdFor(screw, 300);
    fireEvent.pointerUp(screw);

    // Act
    act(() => {
      vi.advanceTimersByTime(SCREW_HOLD_MS * 2);
    });

    // Assert
    expect(screws()).toHaveLength(brokenSiren.screws.length);
  });

  it('途中で離して押し直したとき、続きから回って外れる', () => {
    // Arrange
    renderRemoval();
    const [screw] = screws();
    holdFor(screw, 600);
    fireEvent.pointerUp(screw);
    fireEvent.pointerDown(screw);

    // Act
    act(() => {
      vi.advanceTimersByTime(SCREW_HOLD_MS - 600);
    });

    // Assert
    expect(screws()).toHaveLength(brokenSiren.screws.length - 1);
  });

  it('ねじが残っているとき、外し終わりは伝わらない', () => {
    // Arrange
    const { onFinished } = renderRemoval();
    holdFor(screws()[0], SCREW_HOLD_MS);

    // Act
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // Assert
    expect(onFinished).not.toHaveBeenCalled();
  });
});

describe('②部品交換：新しい部品をつける', () => {
  const renderInstallation = () => {
    const onFinished = vi.fn();
    const sut = <InstallationStep request={brokenSiren} onFinished={onFinished} />;
    render(sut);
    return { onFinished };
  };

  it('部品を場所の近くで離したとき、ねじが現れる', () => {
    // Arrange
    renderInstallation();

    // Act
    dropPartAt(toWorkbench(slotOf(brokenSiren)));

    // Assert
    expect(screws()).toHaveLength(brokenSiren.screws.length);
  });

  it('部品を場所から遠くで離したとき、ねじは現れない', () => {
    // Arrange
    renderInstallation();

    // Act
    dropPartAt({ x: 100, y: 100 });

    // Assert
    expect(screws()).toHaveLength(0);
  });

  it('部品をはめて全部のねじを締めたとき、つけ終わりが伝わる', () => {
    // Arrange
    const { onFinished } = renderInstallation();
    dropPartAt(toWorkbench(slotOf(brokenSiren)));
    holdEveryScrew();

    // Act
    act(() => {
      vi.runOnlyPendingTimers();
    });

    // Assert
    expect(onFinished).toHaveBeenCalledOnce();
  });
});

describe('②部品交換の流れ', () => {
  it('ねじを全部外したとき、新しい部品が出てくる', () => {
    // Arrange
    renderScreen(brokenSiren, 'fixing');
    holdEveryScrew();

    // Act
    act(() => {
      vi.advanceTimersByTime(PART_FALL_MS);
    });

    // Assert
    expect(screen.getByTestId('new-part')).toBeInTheDocument();
  });

  it('外して、はめて、締め終わったとき、②の完了が伝わる', () => {
    // Arrange
    const { onFinishStage } = renderScreen(brokenSiren, 'fixing');
    holdEveryScrew();
    act(() => {
      vi.advanceTimersByTime(PART_FALL_MS);
    });
    dropPartAt(toWorkbench(slotOf(brokenSiren)));
    holdEveryScrew();

    // Act
    act(() => {
      vi.runOnlyPendingTimers();
    });

    // Assert
    expect(onFinishStage).toHaveBeenCalledWith('fixing');
  });
});

describe('②空気入れ', () => {
  const pump = () => screen.getByRole('button', { name: 'くうきいれ' });

  it('くうきいれを決まった時間長押ししたとき、②の完了が伝わる', () => {
    // Arrange
    const { onFinishStage } = renderScreen(flatTyre, 'fixing');
    holdFor(pump(), FIX_HOLD_MS);

    // Act
    act(() => {
      vi.runOnlyPendingTimers();
    });

    // Assert
    expect(onFinishStage).toHaveBeenCalledWith('fixing');
  });

  it('くうきいれを短く押して離したとき、時間がたっても②は完了にならない', () => {
    // Arrange
    const { onFinishStage } = renderScreen(flatTyre, 'fixing');
    holdFor(pump(), 500);
    fireEvent.pointerUp(pump());

    // Act
    act(() => {
      vi.advanceTimersByTime(FIX_HOLD_MS * 2);
    });

    // Assert
    expect(onFinishStage).not.toHaveBeenCalled();
  });

  it('くうきいれを途中で離したとき、メーターはそこまでたまったままになる', () => {
    // Arrange
    renderScreen(flatTyre, 'fixing');
    holdFor(pump(), FIX_HOLD_MS / 2);

    // Act
    fireEvent.pointerUp(pump());

    // Assert
    expect(screen.getByRole('progressbar', { name: 'くうき' })).toHaveAttribute('aria-valuenow', '50');
  });
});

describe('②オイル', () => {
  it('おいるさしを決まった時間長押ししたとき、②の完了が伝わる', () => {
    // Arrange
    const { onFinishStage } = renderScreen(dryEngine, 'fixing');
    holdFor(screen.getByRole('button', { name: 'おいるさし' }), FIX_HOLD_MS);

    // Act
    act(() => {
      vi.runOnlyPendingTimers();
    });

    // Assert
    expect(onFinishStage).toHaveBeenCalledWith('fixing');
  });
});
