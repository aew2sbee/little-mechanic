import { STAGES, type RepairStage } from './repairFlow';
import './repair.css';

const LABELS: Record<RepairStage, string> = {
  trouble: 'こまった',
  removal: 'はずす',
  installation: 'つける',
  cleaning: 'おそうじ',
  celebration: 'げんき',
};

/** Five stars that fill in as the repair moves along: progress anyone can read. */
export function StepBar({ stage }: { stage: RepairStage }) {
  const current = STAGES.indexOf(stage);
  return (
    <ol className="step-bar" aria-label="なおす じゅんばん">
      {STAGES.map((step, index) => (
        <li
          key={step}
          className={index < current ? 'step step--done' : index === current ? 'step step--current' : 'step'}
          aria-label={LABELS[step]}
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
