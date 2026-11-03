// Sound effects synthesized with Web Audio, so no audio files are needed.
// Sound is a bonus: where Web Audio is missing or blocked, everything stays silent instead of failing.

export type SoundName =
  | 'tap'
  | 'nope'
  | 'ratchet'
  | 'pop'
  | 'clunk'
  | 'scrub'
  | 'sparkle'
  | 'vroom'
  | 'fanfare'
  | 'sticker';

export interface SoundPlayer {
  /** Call from a user gesture: browsers keep audio muted until then. */
  unlock(): void;
  play(name: SoundName): void;
  setMuted(muted: boolean): void;
}

type Tone = {
  frequency: number;
  /** Frequency reached at the end of the tone; defaults to `frequency`. */
  endFrequency?: number;
  start?: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
};

const arpeggio = (notes: number[], step: number, volume: number): Tone[] =>
  notes.map((frequency, index) => ({
    frequency,
    start: index * step,
    duration: step * 2.4,
    type: 'triangle',
    volume,
  }));

const TONES: Record<SoundName, Tone[]> = {
  tap: [{ frequency: 660, duration: 0.07, type: 'triangle', volume: 0.2 }],
  nope: [{ frequency: 260, endFrequency: 180, duration: 0.2, type: 'sine', volume: 0.22 }],
  ratchet: [
    { frequency: 1100, duration: 0.03, type: 'square', volume: 0.08 },
    { frequency: 900, start: 0.06, duration: 0.03, type: 'square', volume: 0.08 },
  ],
  pop: [{ frequency: 320, endFrequency: 1200, duration: 0.14, type: 'sine', volume: 0.25 }],
  clunk: [
    { frequency: 150, endFrequency: 70, duration: 0.16, type: 'triangle', volume: 0.4 },
    { frequency: 880, start: 0.08, duration: 0.1, type: 'triangle', volume: 0.15 },
  ],
  scrub: [{ frequency: 420, endFrequency: 520, duration: 0.05, type: 'sawtooth', volume: 0.03 }],
  sparkle: arpeggio([1319, 1568, 1976, 2637], 0.07, 0.14),
  vroom: [
    { frequency: 70, endFrequency: 190, duration: 0.7, type: 'sawtooth', volume: 0.16 },
    { frequency: 190, endFrequency: 110, start: 0.7, duration: 0.5, type: 'sawtooth', volume: 0.12 },
  ],
  fanfare: arpeggio([523, 659, 784, 1047, 784, 1047], 0.13, 0.2),
  sticker: arpeggio([784, 1175], 0.09, 0.2),
};

interface SoundPlayerOptions {
  /** Injected so tests can run without real audio. Returns nothing where Web Audio is missing. */
  createContext?: () => AudioContext | undefined;
}

function createBrowserContext(): AudioContext | undefined {
  return typeof AudioContext === 'undefined' ? undefined : new AudioContext();
}

export function createSoundPlayer({ createContext = createBrowserContext }: SoundPlayerOptions = {}): SoundPlayer {
  let context: AudioContext | undefined;
  let muted = false;

  const usableContext = (): AudioContext | undefined => {
    context ??= createContext();
    if (context && context.state !== 'running') void context.resume().catch(() => {});
    return context;
  };

  const playTone = (audio: AudioContext, tone: Tone): void => {
    const start = audio.currentTime + (tone.start ?? 0);
    const end = start + tone.duration;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = tone.type ?? 'sine';
    oscillator.frequency.setValueAtTime(tone.frequency, start);
    if (tone.endFrequency) oscillator.frequency.linearRampToValueAtTime(tone.endFrequency, end);
    gain.gain.setValueAtTime(tone.volume ?? 0.2, start);
    gain.gain.exponentialRampToValueAtTime(0.001, end);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start(start);
    oscillator.stop(end);
  };

  return {
    unlock() {
      try {
        usableContext();
      } catch {
        // No usable Web Audio.
      }
    },
    play(name) {
      if (muted) return;
      try {
        const audio = usableContext();
        if (audio) TONES[name].forEach((tone) => playTone(audio, tone));
      } catch {
        // No usable Web Audio.
      }
    },
    setMuted(value) {
      muted = value;
    },
  };
}
