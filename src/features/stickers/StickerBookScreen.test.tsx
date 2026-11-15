import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { REPAIR_REQUESTS } from '@/features/vehicles';
import { StickerBookScreen } from './StickerBookScreen';

const allIds = REPAIR_REQUESTS.map((request) => request.id);

const renderBook = (collected: string[], isParadeUnlocked = false) => {
  const onOpenParade = vi.fn();
  render(
    <StickerBookScreen
      requests={REPAIR_REQUESTS}
      collected={collected}
      isParadeUnlocked={isParadeUnlocked}
      onOpenParade={onOpenParade}
      onClose={vi.fn()}
    />,
  );
  return { onOpenParade };
};

describe('シール帳の画面', () => {
  it('表示したとき、全部の枠が見える', () => {
    // Arrange
    const collected: string[] = [];

    // Act
    renderBook(collected);

    // Assert
    expect(screen.getAllByRole('listitem')).toHaveLength(20);
  });

  it('シールを1枚持っているとき、その枠だけシールが貼られる', () => {
    // Arrange
    const collected = ['police-tire'];

    // Act
    renderBook(collected);

    // Assert
    expect(screen.getByRole('listitem', { name: 'ぱとかーの たいやの しーる' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem', { name: 'まだ ない しーる' })).toHaveLength(19);
  });

  it('パレードが解放されていないとき、鍵のボタンが見える', () => {
    // Arrange
    const collected = ['police-tire'];

    // Act
    renderBook(collected);

    // Assert
    expect(screen.getByRole('button', { name: 'ぱれーどは まだ あそべない' })).toBeInTheDocument();
  });

  it('パレードが解放されているとき、押すとパレードが開く', async () => {
    // Arrange
    const user = userEvent.setup();
    const { onOpenParade } = renderBook(allIds, true);

    // Act
    await user.click(screen.getByRole('button', { name: 'ぱれーど' }));

    // Assert
    expect(onOpenParade).toHaveBeenCalledOnce();
  });
});
