import { describe, expect, it } from 'vitest';
import { createRepairFlow, type RepairFlow } from './repairFlow';

const finishToolStep = (flow: RepairFlow) => flow.pickTool('wrench');

describe('修理の工程進行', () => {
  it('修理を始めたとき、①困ったから始まる', () => {
    // Arrange
    const options = { correctTool: 'wrench' } as const;

    // Act
    const sut = createRepairFlow(options);

    // Assert
    expect(sut.stage).toBe('trouble');
  });

  it('正しい工具を選んだとき、②取り外しに進む', () => {
    // Arrange
    const sut = createRepairFlow({ correctTool: 'wrench' });

    // Act
    const result = sut.pickTool('wrench');

    // Assert
    expect(result.stage).toBe('removal');
  });

  it('まちがった工具を選んだとき、①困ったのまま進まない', () => {
    // Arrange
    const sut = createRepairFlow({ correctTool: 'wrench' });

    // Act
    const result = sut.pickTool('drill');

    // Assert
    expect(result.stage).toBe('trouble');
  });

  it('まちがった工具を選び続けたあとでも、失敗にならず正しい工具で進める', () => {
    // Arrange
    const sut = createRepairFlow({ correctTool: 'wrench' }).pickTool('drill').pickTool('pliers').pickTool('drill');

    // Act
    const result = sut.pickTool('wrench');

    // Assert
    expect(result.stage).toBe('removal');
  });

  it('工程を順に終えたとき、①から⑤の順に進んで修理が終わる', () => {
    // Arrange
    const sut = finishToolStep(createRepairFlow({ correctTool: 'wrench' }));
    const visited = [sut.stage];

    // Act
    const result = (['removal', 'installation', 'cleaning', 'celebration'] as const).reduce((flow, stage) => {
      const next = flow.finishStage(stage);
      visited.push(next.stage);
      return next;
    }, sut);

    // Assert
    expect(visited).toEqual(['removal', 'installation', 'cleaning', 'celebration', 'finished']);
    expect(result.stage).toBe('finished');
  });

  it('今の工程ではない完了の知らせが来たとき、工程は進まない', () => {
    // Arrange
    const sut = finishToolStep(createRepairFlow({ correctTool: 'wrench' }));

    // Act
    const result = sut.finishStage('cleaning');

    // Assert
    expect(result.stage).toBe('removal');
  });

  it('同じ工程の完了の知らせが2回来たとき、1つしか進まない', () => {
    // Arrange
    const sut = finishToolStep(createRepairFlow({ correctTool: 'wrench' })).finishStage('removal');

    // Act
    const result = sut.finishStage('removal');

    // Assert
    expect(result.stage).toBe('installation');
  });

  it('①困ったを過ぎたあとに工具を選んだとき、工程は変わらない', () => {
    // Arrange
    const sut = finishToolStep(createRepairFlow({ correctTool: 'wrench' }));

    // Act
    const result = sut.pickTool('wrench');

    // Assert
    expect(result.stage).toBe('removal');
  });
});
