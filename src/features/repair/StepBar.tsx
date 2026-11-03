import type { RepairStage } from './repairFlow';
import './repair.css';

const STEPS: { stage: RepairStage; label: string }[] = [
  { stage: 'trouble', label: 'こまった' },
  { stage: 'removal', label: 'はずす' },
  { stage: 'installation', label: 'つける' },
  { stage: 'cleaning', label: 'おそうじ' },
  { stage: 'celebration', label: 'げんき' },
];

/** Five stars that fill in as the repair moves along: progress anyone can read. */
export function StepBar({ stage }: { stage: RepairStage }) {
  const current = STEPS.findIndex((step) => step.stage === stage);
  return (
    <ol className="step-bar" aria-label="なおす じゅんばん">
      {STEPS.map((step, index) => (
        <li
          key={step.stage}
          className={index < current ? 'step step--done' : index === current ? 'step step--current' : 'step'}
          aria-label={step.label}
          aria-current={index === current ? 'step' : undefined}
        >
          <svg viewBox="-24 -24 48 48" aria-hidden="true">
            <path d="M0 -21 6 -7 21 -6 9 4 13 19 0 11 -13 19 -9 4 -21 -6 -6 -7Z" />
          </svg>
        </li>
      ))}
    </ol>
  );
}
