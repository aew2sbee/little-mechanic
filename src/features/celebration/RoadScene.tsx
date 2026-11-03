import type { ReactNode } from 'react';
import { STAGE_SIZE, StageBackdrop } from '@/shared/ui';
import './celebration.css';

const CONFETTI_COLOURS = ['#ff8a7a', '#ffd25e', '#7fd6a0', '#7fc7f0', '#c9a0ec'];
const CONFETTI = Array.from({ length: 36 }, (_, index) => ({
  left: `${(index * 37) % 100}%`,
  delay: `${(index % 9) * 0.3}s`,
  background: CONFETTI_COLOURS[index % CONFETTI_COLOURS.length],
}));

/** The open road outside the garage, where repaired vehicles go to show off. */
export function RoadScene({ children }: { children: ReactNode }) {
  const { width, height } = STAGE_SIZE;
  return (
    <>
      <StageBackdrop>
        <rect width={width} height={height} fill="#a8e2f7" />
        <circle cx="1120" cy="110" r="66" fill="#ffe27a" />
        <g fill="#fff">
          <ellipse cx="230" cy="120" rx="96" ry="34" />
          <ellipse cx="290" cy="96" rx="62" ry="34" />
          <ellipse cx="760" cy="170" rx="80" ry="28" />
          <ellipse cx="810" cy="150" rx="50" ry="28" />
        </g>
        <path d={`M0 470 Q200 320 420 450 T860 430 T${width} 460 V${height} H0 Z`} fill="#9fdc8f" />
        <path d={`M0 530 Q320 420 640 520 T${width} 500 V${height} H0 Z`} fill="#7cc974" />
        <rect y="580" width={width} height={height - 580} fill="#6f7687" />
        <rect y="572" width={width} height="14" fill="#fff6e4" />
        <path d={`M0 688 H${width}`} stroke="#fff6e4" strokeWidth="10" strokeDasharray="80 60" />
      </StageBackdrop>
      <div className="confetti" aria-hidden="true">
        {CONFETTI.map((piece, index) => (
          <span
            key={index}
            className="confetti__piece"
            style={{ left: piece.left, animationDelay: piece.delay, background: piece.background }}
          />
        ))}
      </div>
      {children}
    </>
  );
}
