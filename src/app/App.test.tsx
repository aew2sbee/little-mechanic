import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createParentSettings } from '@/features/parent-settings';
import { createStickerBook } from '@/features/stickers';
import { REPAIR_REQUESTS } from '@/features/vehicles';
import type { SoundPlayer } from '@/shared/sound';
import { App } from './App';
import type { AppDependencies, AppStorage } from './dependencies';

const GATE_NAME = 'ほごしゃ せってい（3びょう ながおし）';

function createFakeStorage(): AppStorage {
  const items = new Map<string, string>();
  return {
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => void items.set(key, value),
    removeItem: (key) => void items.delete(key),
  };
}

function createFakeSound(): SoundPlayer {
  return { unlock: vi.fn(), play: vi.fn(), setMuted: vi.fn() };
}

function createDependencies(overrides: Partial<AppDependencies> = {}): AppDependencies {
  return { random: () => 0, storage: createFakeStorage(), sound: createFakeSound(), ...overrides };
}

const tapFirstCar = () => {
  fireEvent.click(screen.getAllByRole('button', { name: /なおす$/ })[0]);
};

describe('アプリ全体の画面遷移', () => {
  it('起動したとき、ガレージに3台のくるまが並ぶ', () => {
    // Arrange
    const dependencies = createDependencies();

    // Act
    render(<App dependencies={dependencies} />);

    // Assert
    expect(screen.getAllByRole('button', { name: /なおす$/ })).toHaveLength(3);
  });

  it('くるまを押したとき、①困ったの画面になる', () => {
    // Arrange
    render(<App dependencies={createDependencies()} />);

    // Act
    tapFirstCar();

    // Assert
    expect(screen.getByRole('group', { name: 'こうぐ' })).toBeInTheDocument();
  });

  it('修理の途中でがれーじを押したとき、同じ3台のガレージに戻る', () => {
    // Arrange
    render(<App dependencies={createDependencies()} />);
    const before = screen.getAllByRole('button', { name: /なおす$/ }).map((car) => car.getAttribute('aria-label'));
    tapFirstCar();

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'がれーじ' }));

    // Assert
    const after = screen.getAllByRole('button', { name: /なおす$/ }).map((car) => car.getAttribute('aria-label'));
    expect(after).toEqual(before);
  });

  it('しーるを押したとき、シール帳の画面になる', () => {
    // Arrange
    render(<App dependencies={createDependencies()} />);

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'しーる' }));

    // Assert
    expect(screen.getByRole('list', { name: 'しーるちょう' })).toBeInTheDocument();
  });

  it('保護者設定で効果音をオフにしたとき、音が消音になる', () => {
    // Arrange
    vi.useFakeTimers();
    const sound = createFakeSound();
    render(<App dependencies={createDependencies({ sound })} />);
    fireEvent.pointerDown(screen.getByRole('button', { name: GATE_NAME }));
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Act
    fireEvent.click(screen.getByRole('switch', { name: '効果音' }));

    // Assert
    expect(sound.setMuted).toHaveBeenLastCalledWith(true);
    vi.useRealTimers();
  });
});

describe('保護者設定からの初期化', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const openResetDialog = () => {
    fireEvent.pointerDown(screen.getByRole('button', { name: GATE_NAME }));
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    fireEvent.click(screen.getByRole('button', { name: '初期化' }));
  };

  it('シールをすべて集めたあとで初期化したとき、シールは0枚に戻る', () => {
    // Arrange
    const storage = createFakeStorage();
    const book = createStickerBook({ storage, stickerIds: REPAIR_REQUESTS.map((request) => request.id) });
    REPAIR_REQUESTS.forEach((request) => book.collect(request.id));
    render(<App dependencies={createDependencies({ storage })} />);
    openResetDialog();

    // Act
    fireEvent.click(screen.getByRole('button', { name: '初期化する' }));

    // Assert
    expect(screen.getByText(`シール 0 / ${REPAIR_REQUESTS.length} 枚`)).toBeInTheDocument();
  });

  it('効果音をオフにしたあとで初期化したとき、音が鳴るように戻る', () => {
    // Arrange
    const storage = createFakeStorage();
    createParentSettings({ storage }).setSoundOn(false);
    const sound = createFakeSound();
    render(<App dependencies={createDependencies({ storage, sound })} />);
    openResetDialog();

    // Act
    fireEvent.click(screen.getByRole('button', { name: '初期化する' }));

    // Assert
    expect(sound.setMuted).toHaveBeenLastCalledWith(false);
  });
});
