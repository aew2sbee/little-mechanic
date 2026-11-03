import { describe, expect, it } from 'vitest';
import { createRepairFlow, type RepairFlow } from './repairFlow';

const finishToolStep = (flow: RepairFlow) => flow.pickTool('pump');

describe('修理の工程進行', () => {
  it('修理を始めたとき、①困ったから始まる', () => {
    // Arrange
    const options = { correctTool: 'pump' } as const;

    // Act
    const sut = createRepairFlow(options);

    // Assert
    expect(sut.stage).toBe('trouble');
  });

  it('正しい工具を選んだとき、②なおすに進む', () => {
    // Arrange
    const sut = createRepairFlow({ correctTool: 'pump' });

    // Act
    const result = sut.pickTool('pump');

    // Assert
    expect(result.stage).toBe('fixing');
  });

  it('まちがった工具を選んだとき、①困ったのまま進まない', () => {
    // Arrange
    const sut = createRepairFlow({ correctTool: 'pump' });

    // Act
    const result = sut.pickTool('oiler');

    // Assert
    expect(result.stage).toBe('trouble');
  });

  it('まちがった工具を選び続けたあとでも、失敗にならず正しい工具で進める', () => {
    // Arrange
    const sut = createRepairFlow({ correctTool: 'pump' }).pickTool('oiler').pickTool('driver').pickTool('oiler');

    // Act
    const result = sut.pickTool('pump');

    // Assert
    expect(result.stage).toBe('fixing');
  });

  it('工程を順に終えたとき、①から③の順に進む', () => {
    // Arrange
    const sut = createRepairFlow({ correctTool: 'pump' });
    const visited = [sut.stage];

    // Act
    const fixing = sut.pickTool('pump');
    visited.push(fixing.stage, fixing.finishStage('fixing').stage);

    // Assert
    expect(visited).toEqual(['trouble', 'fixing', 'celebration']);
  });

  it('今の工程ではない完了の知らせが来たとき、工程は進まない', () => {
    // Arrange
    const sut = createRepairFlow({ correctTool: 'pump' });

    // Act
    const result = sut.finishStage('fixing');

    // Assert
    expect(result.stage).toBe('trouble');
  });

  it('同じ工程の完了の知らせが2回来たとき、1つしか進まない', () => {
    // Arrange
    const sut = finishToolStep(createRepairFlow({ correctTool: 'pump' })).finishStage('fixing');

    // Act
    const result = sut.finishStage('fixing');

    // Assert
    expect(result.stage).toBe('celebration');
  });

  it('①困ったを過ぎたあとに工具を選んだとき、工程は変わらない', () => {
    // Arrange
    const sut = finishToolStep(createRepairFlow({ correctTool: 'pump' }));

    // Act
    const result = sut.pickTool('pump');

    // Assert
    expect(result.stage).toBe('fixing');
  });
});
