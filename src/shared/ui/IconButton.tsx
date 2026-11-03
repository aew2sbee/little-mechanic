import type { ReactNode } from 'react';
import { useSound } from '@/shared/sound';
import './ui.css';

interface IconButtonProps {
  /** Read aloud by assistive tech, and shown under the icon when `showLabel` is set. */
  label: string;
  showLabel?: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

/** A big round button: picture first, because the players cannot read yet. */
export function IconButton({ label, showLabel = false, onClick, children, className = '' }: IconButtonProps) {
  const sound = useSound();
  return (
    <button
      type="button"
      className={`icon-button ${className}`}
      aria-label={label}
      onClick={() => {
        sound.play('tap');
        onClick();
      }}
    >
      <span className="icon-button__face" aria-hidden="true">
        {children}
      </span>
      {showLabel && (
        <span className="icon-button__label" aria-hidden="true">
          {label}
        </span>
      )}
    </button>
  );
}

const iconProps = {
  viewBox: '0 0 64 64',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export function HomeIcon() {
  return (
    <svg {...iconProps}>
      <path d="M8 30 32 10l24 20" />
      <path d="M15 27v27h34V27" fill="#fff6e4" />
      <path d="M27 54V38h10v16" />
    </svg>
  );
}

export function BookIcon() {
  return (
    <svg {...iconProps}>
      <path d="M10 14c8-3 15-2 22 3 7-5 14-6 22-3v36c-8-3-15-2-22 3-7-5-14-6-22-3z" fill="#fff6e4" />
      <path d="M32 17v36" />
    </svg>
  );
}

export function ArrowIcon() {
  return (
    <svg {...iconProps}>
      <path d="M10 32h42" />
      <path d="M34 14l18 18-18 18" />
    </svg>
  );
}

export function FlagIcon() {
  return (
    <svg {...iconProps}>
      <path d="M16 58V8" />
      <path d="M16 10c12-6 20 6 34 0v26c-14 6-22-6-34 0z" fill="#ff8a7a" />
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg {...iconProps}>
      <rect x="12" y="28" width="40" height="28" rx="6" fill="#fff6e4" />
      <path d="M20 28V20a12 12 0 0 1 24 0v8" />
    </svg>
  );
}

export function GearIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="32" cy="32" r="10" />
      <path d="M32 6v10M32 48v10M6 32h10M48 32h10M14 14l7 7M43 43l7 7M50 14l-7 7M21 43l-7 7" />
    </svg>
  );
}
