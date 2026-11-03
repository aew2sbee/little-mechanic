import type { ToolId } from '@/features/vehicles';

/**
 * The steps of a repair, in order: ① to ③. ② is whatever the trouble needs (a new part, air or
 * oil). After ③ the vehicle goes back to the garage.
 */
export const STAGES = ['trouble', 'fixing', 'celebration'] as const;

export type RepairStage = (typeof STAGES)[number];

/** Steps that end when their screen says so. ① ends by picking a tool, and ③ hands over to the garage. */
export type FinishableStage = Exclude<RepairStage, 'trouble' | 'celebration'>;

export interface RepairFlow {
  readonly stage: RepairStage;
  /** A wrong tool changes nothing: there is no failure in this game, only trying again. */
  pickTool(tool: ToolId): RepairFlow;
  /** Ignored unless `stage` is the current one, so a late or repeated report cannot skip a step. */
  finishStage(stage: FinishableStage): RepairFlow;
}

export function createRepairFlow({ correctTool }: { correctTool: ToolId }): RepairFlow {
  const at = (stage: RepairStage): RepairFlow => {
    const next = () => at(STAGES[STAGES.indexOf(stage) + 1]);
    const flow: RepairFlow = {
      stage,
      pickTool: (tool) => (stage === 'trouble' && tool === correctTool ? next() : flow),
      finishStage: (finished) => (finished === stage ? next() : flow),
    };
    return flow;
  };
  return at('trouble');
}
