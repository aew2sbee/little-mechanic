import type { CSSProperties } from 'react';
import type { Point } from '@/shared/ui';
import './hint.css';

interface FingerHintProps {
  /** Where the fingertip points, in the coordinates of the parent screen. */
  at: Point;
  /** When set, the finger slides from `at` to here again and again, showing a drag. */
  dragTo?: Point;
  /** The finger presses and stays down while a ring grows, showing a long press. */
  hold?: boolean;
}

/** A pointing hand. It never catches touches, so the child can tap straight through it. */
export function FingerHint({ at, dragTo, hold = false }: FingerHintProps) {
  const style = {
    left: at.x,
    top: at.y,
    '--drag-x': `${dragTo ? dragTo.x - at.x : 0}px`,
    '--drag-y': `${dragTo ? dragTo.y - at.y : 0}px`,
  } as CSSProperties;
  const className = dragTo ? 'finger-hint finger-hint--drag' : hold ? 'finger-hint finger-hint--hold' : 'finger-hint';

  return (
    <div className={className} style={style} role="img" aria-label="ここを さわってね">
      <svg viewBox="0 0 80 100" aria-hidden="true">
        <path
          d="M32 6c6 0 10 4 10 10v28l20 5c8 2 12 8 11 16l-3 21c-1 6-6 9-12 9H36c-5 0-9-2-12-7L9 62c-3-4-2-9 2-12s9-2 12 2V16c0-6 4-10 9-10z"
          fill="#ffe0c2"
          stroke="#2b2a3d"
          strokeWidth="5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
