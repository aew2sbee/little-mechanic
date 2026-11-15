import { useEffect, useState } from 'react';
import { GearIcon } from '@/shared/ui';
import { createLongPress, LONG_PRESS_MS } from './longPress';
import './parent-settings.css';

/** A quiet corner button. It opens only after a long press, so children stay out by accident. */
export function ParentSettingsGate({ onOpen }: { onOpen: () => void }) {
  const [isPressing, setIsPressing] = useState(false);
  const [longPress] = useState(() =>
    createLongPress({
      onLongPress: () => {
        setIsPressing(false);
        onOpen();
      },
    }),
  );

  useEffect(() => () => longPress.release(), [longPress]);

  const press = () => {
    setIsPressing(true);
    longPress.press();
  };
  const release = () => {
    setIsPressing(false);
    longPress.release();
  };

  return (
    <button
      type="button"
      className={isPressing ? 'parent-gate parent-gate--pressing' : 'parent-gate'}
      style={{ animationDuration: `${LONG_PRESS_MS}ms` }}
      aria-label="ほごしゃ せってい（3びょう ながおし）"
      onPointerDown={press}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
    >
      <GearIcon />
    </button>
  );
}
