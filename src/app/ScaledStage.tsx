import { useEffect, useState, type ReactNode } from 'react';
import { STAGE_SIZE } from '@/shared/ui';
import { fitStage } from './stageFit';

const readViewport = () => ({ width: window.innerWidth, height: window.innerHeight });

/** Lays every screen out on one fixed-size stage and scales it to fit the device. */
export function ScaledStage({ children }: { children: ReactNode }) {
  const [viewport, setViewport] = useState(readViewport);

  useEffect(() => {
    const onResize = () => setViewport(readViewport());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { scale, left, top } = fitStage(viewport, STAGE_SIZE);

  return (
    <div
      className="stage"
      style={{
        width: STAGE_SIZE.width,
        height: STAGE_SIZE.height,
        transform: `translate(${left}px, ${top}px) scale(${scale})`,
      }}
    >
      {children}
    </div>
  );
}
