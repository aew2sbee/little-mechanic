import { describe, expect, it } from 'vitest';
import { createRepairQueue } from './repairQueue';

const requests = ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id }));

/** Returns the given values in turn, forever. */
const fixedRandom = (...values: number[]) => {
  let index = 0;
  return () => values[index++ % values.length];
};

describe('修理待ちキュー', () => {
  it('作ったとき、3台並ぶ', () => {
    // Arrange
    const random = fixedRandom(0);

    // Act
    const sut = createRepairQueue({ requests, random });

    // Assert
    expect(sut.waiting).toHaveLength(3);
  });

  it('作ったとき、同じ依頼は並ばない', () => {
    // Arrange
    const random = fixedRandom(0);

    // Act
    const sut = createRepairQueue({ requests, random });

    // Assert
    expect(new Set(sut.waiting).size).toBe(3);
  });

  it('1台なおしたとき、また3台並ぶ', () => {
    // Arrange
    const sut = createRepairQueue({ requests, random: fixedRandom(0) });

    // Act
    const result = sut.complete(sut.waiting[1].id);

    // Assert
    expect(result.waiting).toHaveLength(3);
  });

  it('1台なおしたとき、残りの2台は順番を保って前に詰める', () => {
    // Arrange
    const sut = createRepairQueue({ requests, random: fixedRandom(0) });
    const [first, second, third] = sut.waiting;

    // Act
    const result = sut.complete(first.id);

    // Assert
    expect(result.waiting.slice(0, 2)).toEqual([second, third]);
  });

  it.each([0, 0.25, 0.5, 0.75, 0.999])('乱数が %s のとき、なおしたばかりの依頼はすぐには並ばない', (value) => {
    // Arrange
    const sut = createRepairQueue({ requests, random: fixedRandom(value) });
    const finished = sut.waiting[0];

    // Act
    const result = sut.complete(finished.id);

    // Assert
    expect(result.waiting).not.toContain(finished);
  });

  it('何台なおし続けたあとでも、並ぶ依頼に重複は出ない', () => {
    // Arrange
    const sut = createRepairQueue({ requests, random: fixedRandom(0.1, 0.9, 0.4, 0.7) });

    // Act
    const history = Array.from({ length: 50 }).reduce<typeof sut[]>(
      (queues) => [...queues, queues.at(-1)!.complete(queues.at(-1)!.waiting[0].id)],
      [sut],
    );

    // Assert
    expect(history.every((queue) => new Set(queue.waiting).size === 3)).toBe(true);
  });

  it('優先したい依頼があるとき、そちらから並ぶ', () => {
    // Arrange
    const prefer = (request: { id: string }) => ['d', 'e'].includes(request.id);
    const random = fixedRandom(0);

    // Act
    const sut = createRepairQueue({ requests, random, prefer });

    // Assert
    expect(sut.waiting.slice(0, 2).map((request) => request.id)).toEqual(['d', 'e']);
  });

  it('優先したい依頼がなくなったとき、ほかの依頼から並ぶ', () => {
    // Arrange
    const prefer = () => false;
    const random = fixedRandom(0);

    // Act
    const sut = createRepairQueue({ requests, random, prefer });

    // Assert
    expect(sut.waiting).toHaveLength(3);
  });

  describe('直し方をばらばらにする', () => {
    const mixed = [
      { id: 'a', fix: 'replace' },
      { id: 'b', fix: 'replace' },
      { id: 'c', fix: 'replace' },
      { id: 'd', fix: 'inflate' },
      { id: 'e', fix: 'oil' },
    ];
    const varietyOf = (request: (typeof mixed)[number]) => request.fix;

    it('ちがう直し方の依頼があるとき、同じ直し方は並ばない', () => {
      // Arrange
      const random = fixedRandom(0);

      // Act
      const sut = createRepairQueue({ requests: mixed, random, varietyOf });

      // Assert
      expect(new Set(sut.waiting.map(varietyOf)).size).toBe(3);
    });

    it('1台なおしたとき、なおした依頼と同じ直し方の依頼が入る', () => {
      // Arrange
      const sut = createRepairQueue({ requests: mixed, random: fixedRandom(0), varietyOf });
      const finished = sut.waiting[0];

      // Act
      const result = sut.complete(finished.id);

      // Assert
      expect(result.waiting.at(-1)?.fix).toBe(finished.fix);
    });

    it('同じ直し方の中では、優先したい依頼から並ぶ', () => {
      // Arrange
      const prefer = (request: { id: string }) => request.id === 'c';
      const random = fixedRandom(0);

      // Act
      const sut = createRepairQueue({ requests: mixed, random, varietyOf, prefer });

      // Assert
      expect(sut.waiting.map((request) => request.id)).toContain('c');
    });
  });

  it('なおした依頼のidが並んでいないとき、キューは変わらない', () => {
    // Arrange
    const sut = createRepairQueue({ requests, random: fixedRandom(0) });

    // Act
    const result = sut.complete('none');

    // Assert
    expect(result).toBe(sut);
  });
});
