import type { ToolId } from '@/features/vehicles';

/** The steps of a repair, in order: ① to ⑤, then back to the garage. */
const STAGES = ['trouble', 'removal', 'installation', 'cleaning', 'celebration', 'finished'] as const;

export type RepairStage = (typeof STAGES)[number];

/** Steps that end when their screen says so. The first ends by picking a tool, and the last never ends. */
export type FinishableStage = Exclude<RepairStage, 'trouble' | 'finished'>;

export interface RepairFlow {
  readonly stage: RepairStage;
  /** A wrong tool changes nothing: there is no failure in this game, only trying again. */
  pickTool(tool: ToolId): RepairFlow;
  /** Ignored unless `stage` is the current one, so a late or repeated report cannot skip a step. */
  finishStage(stage: FinishableStage): RepairFlow;
}

export function createRepairFlow({
  correctTool,
  stage = 'trouble',
}: {
  correctTool: ToolId;
  stage?: RepairStage;
}): RepairFlow {
  const nextStep = () => createRepairFlow({ correctTool, stage: STAGES[STAGES.indexOf(stage) + 1] });

  const flow: RepairFlow = {
    stage,
    pickTool: (tool) => (stage === 'trouble' && tool === correctTool ? nextStep() : flow),
    finishStage: (finished) => (finished === stage ? nextStep() : flow),
  };
  return flow;
}
