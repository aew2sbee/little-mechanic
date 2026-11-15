import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ParentSettingsGate } from './ParentSettingsGate';
import { ParentSettingsScreen } from './ParentSettingsScreen';

const GATE_NAME = 'ほごしゃ せってい（3びょう ながおし）';
const DIALOG_NAME = 'データを初期化しますか？';

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
    const onReset = vi.fn();
    const onSoundChange = vi.fn();
    render(
      <ParentSettingsScreen
        isSoundOn
        onSoundChange={onSoundChange}
        stickerCount={20}
        stickerTotal={20}
        onReset={onReset}
        onClose={vi.fn()}
      />,
    );
    return { onReset, onSoundChange };
  };

  const openDialog = (user: ReturnType<typeof userEvent.setup>) =>
    user.click(screen.getByRole('button', { name: '初期化' }));

  it('効果音のスイッチを押したとき、オフが伝わる', async () => {
    // Arrange
    const user = userEvent.setup();
    const { onSoundChange } = renderScreen();

    // Act
    await user.click(screen.getByRole('switch', { name: '効果音' }));

    // Assert
    expect(onSoundChange).toHaveBeenCalledWith(false);
  });

  it('初期化を押したとき、消える枚数を添えた確認のポップアップが出る', async () => {
    // Arrange
    const user = userEvent.setup();
    renderScreen();

    // Act
    await openDialog(user);

    // Assert
    expect(screen.getByRole('alertdialog', { name: DIALOG_NAME })).toHaveAccessibleDescription(
      'シール（20 / 20 枚）と効果音の設定が消えます。元に戻せません。',
    );
  });

  it('初期化を押しただけのとき、データは消えない', async () => {
    // Arrange
    const user = userEvent.setup();
    const { onReset } = renderScreen();

    // Act
    await openDialog(user);

    // Assert
    expect(onReset).not.toHaveBeenCalled();
  });

  it('ポップアップが出たとき、やめるが選ばれた状態になる', async () => {
    // Arrange
    const user = userEvent.setup();
    renderScreen();

    // Act
    await openDialog(user);

    // Assert
    expect(screen.getByRole('button', { name: 'やめる' })).toHaveFocus();
  });

  it('ポップアップでやめるを押したとき、データは消えない', async () => {
    // Arrange
    const user = userEvent.setup();
    const { onReset } = renderScreen();
    await openDialog(user);

    // Act
    await user.click(screen.getByRole('button', { name: 'やめる' }));

    // Assert
    expect(onReset).not.toHaveBeenCalled();
  });

  it('ポップアップでやめるを押したとき、ポップアップが閉じる', async () => {
    // Arrange
    const user = userEvent.setup();
    renderScreen();
    await openDialog(user);

    // Act
    await user.click(screen.getByRole('button', { name: 'やめる' }));

    // Assert
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('ポップアップでEscキーを押したとき、データは消えずにポップアップが閉じる', async () => {
    // Arrange
    const user = userEvent.setup();
    const { onReset } = renderScreen();
    await openDialog(user);

    // Act
    await user.keyboard('{Escape}');

    // Assert
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(onReset).not.toHaveBeenCalled();
  });

  it('ポップアップで初期化するを押したとき、データが消える', async () => {
    // Arrange
    const user = userEvent.setup();
    const { onReset } = renderScreen();
    await openDialog(user);

    // Act
    await user.click(screen.getByRole('button', { name: '初期化する' }));

    // Assert
    expect(onReset).toHaveBeenCalledOnce();
  });

  it('ポップアップで初期化するを押したとき、ポップアップが閉じて保護者設定に残る', async () => {
    // Arrange
    const user = userEvent.setup();
    renderScreen();
    await openDialog(user);

    // Act
    await user.click(screen.getByRole('button', { name: '初期化する' }));

    // Assert
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '保護者設定' })).toBeInTheDocument();
  });
});
