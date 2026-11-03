import type { ReactNode } from 'react';
import { STAGE_SIZE } from './point';
import './ui.css';

/**
 * A picture filling the whole stage, drawn in stage units. It never catches touches. Put first,
 * it is the screen's background; later, it draws over what comes before it.
 */
export function StageBackdrop({ children }: { children: ReactNode }) {
  const { width, height } = STAGE_SIZE;
  return (
    <svg className="stage-backdrop" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      {children}
    </svg>
  );
}
