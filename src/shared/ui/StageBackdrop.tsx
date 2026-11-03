import type { ReactNode } from 'react';
import { STAGE_SIZE } from './point';
import './ui.css';

/** A picture filling the whole stage, behind everything else on a screen. Draw in stage units. */
export function StageBackdrop({ children }: { children: ReactNode }) {
  const { width, height } = STAGE_SIZE;
  return (
    <svg className="stage-backdrop" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      {children}
    </svg>
  );
}
