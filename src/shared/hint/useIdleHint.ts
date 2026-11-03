import { useEffect, useState } from 'react';
import { createIdleHint } from './idleHint';

/**
 * True once the child has done nothing for a while. Any touch hides the hint and starts the
 * wait again; changing `resetKey` does the same, so a new step never opens with a stale hint.
 */
export function useIdleHint(resetKey?: unknown): boolean {
  const [state, setState] = useState({ isVisible: false, key: resetKey });

  useEffect(() => {
    const hint = createIdleHint({ onChange: (isVisible) => setState({ isVisible, key: resetKey }) });
    const onPointerDown = () => hint.touch();
    window.addEventListener('pointerdown', onPointerDown);
    hint.start();
    return () => {
      hint.stop();
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [resetKey]);

  return state.isVisible && state.key === resetKey;
}
