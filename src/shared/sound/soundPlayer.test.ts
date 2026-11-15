import { describe, expect, it, vi } from 'vitest';
import { createSoundPlayer } from './soundPlayer';

describe('効果音', () => {
  it('消音のとき、音を鳴らさない', () => {
    // Arrange
    const createContext = vi.fn(() => undefined);
    const sut = createSoundPlayer({ createContext });
    sut.setMuted(true);

    // Act
    sut.play('tap');

    // Assert
    expect(createContext).not.toHaveBeenCalled();
  });

  it('Web Audio が使えないとき、例外を出さない', () => {
    // Arrange
    const sut = createSoundPlayer({
      createContext: () => {
        throw new Error('no audio');
      },
    });

    // Act
    const act = () => sut.play('fanfare');

    // Assert
    expect(act).not.toThrow();
  });
});
