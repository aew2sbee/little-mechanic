import type { ToolId } from '@/features/vehicles';

/**
 * The steps of a repair, in order: ① to ③. ② is whatever the trouble needs (a new part, air or
 * oil). After ③ the vehicle goes back to the garage.
 */
export const STAGES = ['trouble', 'fixing', 'celebration'] as const;

export type RepairStage = (typeof STAGES)[number];

export interface RepairFlow {
  readonly stage: RepairStage;
  /** A wrong tool changes nothing: there is no failure in this game, only trying again. */
  pickTool(tool: ToolId): RepairFlow;
  /** ② is done. Ignored unless ② is the current step, so a late or repeated report cannot skip one. */
  finishFixing(): RepairFlow;
}

export function createRepairFlow({ correctTool }: { correctTool: ToolId }): RepairFlow {
  const at = (stage: RepairStage): RepairFlow => {
    const next = () => at(STAGES[STAGES.indexOf(stage) + 1]);
    const flow: RepairFlow = {
      stage,
      pickTool: (tool) => (stage === 'trouble' && tool === correctTool ? next() : flow),
      finishFixing: () => (stage === 'fixing' ? next() : flow),
    };
    return flow;
  };
  return at('trouble');
}
