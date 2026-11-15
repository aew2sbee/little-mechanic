import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ParentSettingsGate } from './ParentSettingsGate';
import { ParentSettingsScreen } from './ParentSettingsScreen';

const GATE_NAME = 'ほごしゃ せってい（3びょう ながおし）';

describe('保護者設定の入口', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('ボタンを3秒押し続けたとき、開く', () => {
    // Arrange
    const onOpen = vi.fn();
    render(<ParentSettingsGate onOpen={onOpen} />);
    fireEvent.pointerDown(screen.getByRole('button', { name: GATE_NAME }));

    // Act
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Assert
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it('ボタンを短く押しただけのとき、開かない', () => {
    // Arrange
    const onOpen = vi.fn();
    render(<ParentSettingsGate onOpen={onOpen} />);
    const sut = screen.getByRole('button', { name: GATE_NAME });
    fireEvent.pointerDown(sut);
    fireEvent.pointerUp(sut);

    // Act
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Assert
    expect(onOpen).not.toHaveBeenCalled();
  });
});

describe('保護者設定の画面', () => {
  const renderScreen = () => {
    const onResetStickers = vi.fn();
    const onSoundChange = vi.fn();
    render(
      <ParentSettingsScreen
        isSoundOn
        onSoundChange={onSoundChange}
        stickerCount={3}
        stickerTotal={20}
        onResetStickers={onResetStickers}
        onClose={vi.fn()}
      />,
    );
    return { onResetStickers, onSoundChange };
  };

  it('効果音のスイッチを押したとき、オフが伝わる', async () => {
    // Arrange
    const user = userEvent.setup();
    const { onSoundChange } = renderScreen();

    // Act
    await user.click(screen.getByRole('switch', { name: '効果音' }));

    // Assert
    expect(onSoundChange).toHaveBeenCalledWith(false);
  });

  it('リセットを1回押しただけのとき、シールは消えない', async () => {
    // Arrange
    const user = userEvent.setup();
    const { onResetStickers } = renderScreen();

    // Act
    await user.click(screen.getByRole('button', { name: 'リセット' }));

    // Assert
    expect(onResetStickers).not.toHaveBeenCalled();
  });

  it('リセットのあとにすべて消すを押したとき、シールが消える', async () => {
    // Arrange
    const user = userEvent.setup();
    const { onResetStickers } = renderScreen();
    await user.click(screen.getByRole('button', { name: 'リセット' }));

    // Act
    await user.click(screen.getByRole('button', { name: 'すべて消す' }));

    // Assert
    expect(onResetStickers).toHaveBeenCalledOnce();
  });
});
