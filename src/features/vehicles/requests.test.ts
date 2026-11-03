import { describe, expect, it } from 'vitest';
import { REPAIR_REQUESTS } from './requests';
import { slotOf, TROUBLE_ICONS } from './catalog';

describe('くるまと依頼のデータ', () => {
  it('一覧を見たとき、依頼は全部で20件ある', () => {
    // Arrange
    const sut = REPAIR_REQUESTS;

    // Act
    const count = sut.length;

    // Assert
    expect(count).toBe(20);
  });

  it('idを集めたとき、重複がない', () => {
    // Arrange
    const sut = REPAIR_REQUESTS;

    // Act
    const ids = new Set(sut.map((request) => request.id));

    // Assert
    expect(ids.size).toBe(sut.length);
  });

  describe.each(REPAIR_REQUESTS.map((request) => [request.id, request] as const))('%s', (_id, sut) => {
    it('部品を見たとき、絵と名前がそろっている', () => {
      // Arrange
      const part = sut.part;

      // Act
      const hasArt = part.shapes.length > 0 && part.name.length > 0;

      // Assert
      expect(hasArt).toBe(true);
    });

    it('くるまを見たとき、部品を取り付ける場所がある', () => {
      // Arrange
      const request = sut;

      // Act
      const slot = slotOf(request);

      // Assert
      expect(slot).toBeDefined();
    });

    it('工具を見たとき、絵と名前がそろっている', () => {
      // Arrange
      const tool = sut.tool;

      // Act
      const hasArt = tool.shapes.length > 0 && tool.name.length > 0;

      // Assert
      expect(hasArt).toBe(true);
    });

    it('ねじ位置を見たとき、1つ以上あって指で押し分けられる間隔になっている', () => {
      // Arrange
      const screws = sut.screws;
      const scale = slotOf(sut).scale ?? 1;

      // Act
      const closest = Math.min(
        Infinity,
        ...screws.flatMap((a, i) => screws.slice(i + 1).map((b) => Math.hypot(a.x - b.x, a.y - b.y) * scale)),
      );

      // Assert
      expect(screws.length).toBeGreaterThan(0);
      expect(closest).toBeGreaterThanOrEqual(44);
    });

    it('汚れを見たとき、1つ以上あってくるまの絵の内側に収まっている', () => {
      // Arrange
      const dirt = sut.dirt;

      // Act
      const isInside = dirt.every((spot) => spot.x >= 0 && spot.x <= 640 && spot.y >= 0 && spot.y <= 360);

      // Assert
      expect(dirt.length).toBeGreaterThan(0);
      expect(isInside).toBe(true);
    });

    it('アイコンを見たとき、絵がそろっている', () => {
      // Arrange
      const icon = sut.icon;

      // Act
      const shapes = TROUBLE_ICONS[icon];

      // Assert
      expect(shapes.length).toBeGreaterThan(0);
    });
  });
});
