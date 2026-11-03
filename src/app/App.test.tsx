import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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
  beforeEach(() => {
    // jsdom has no canvas; the drawing does not change what is measured.
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
  });

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
