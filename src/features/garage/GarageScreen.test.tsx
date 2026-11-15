import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { REPAIR_REQUESTS } from '@/features/vehicles';
import { GarageScreen } from './GarageScreen';

const requests = REPAIR_REQUESTS.slice(0, 3);

describe('ガレージ画面', () => {
  it('表示したとき、修理待ちのくるまが3台見える', () => {
    // Arrange
    const onSelect = vi.fn();

    // Act
    render(<GarageScreen requests={requests} onSelect={onSelect} onOpenStickers={vi.fn()} />);

    // Assert
    expect(screen.getAllByRole('button', { name: /なおす$/ })).toHaveLength(3);
  });

  it('くるまを押したとき、その依頼が選ばれる', async () => {
    // Arrange
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<GarageScreen requests={requests} onSelect={onSelect} onOpenStickers={vi.fn()} />);

    // Act
    await user.click(screen.getByRole('button', { name: 'ぱとかーの たいやを なおす' }));

    // Assert
    expect(onSelect).toHaveBeenCalledWith(requests[1]);
  });
});
