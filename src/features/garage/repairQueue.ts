/** Vehicles waiting in the garage at any moment. */
const QUEUE_SIZE = 3;

export interface RepairQueue<T> {
  readonly waiting: readonly T[];
  /** The queue after `id` is repaired: the rest move up and a new one joins the end. */
  complete(id: string): RepairQueue<T>;
}

interface RepairQueueOptions<T> {
  requests: readonly T[];
  /** A number from 0 up to 1, like `Math.random`. Injected so tests can fix the order. */
  random: () => number;
  /**
   * Requests to line up first. Without this, a child could wait a very long time for the
   * last few stickers by luck alone.
   */
  prefer?: (request: T) => boolean;
  /**
   * Requests that share this value are kept apart: the queue lines up ones that differ while
   * it can, so the garage offers a mix of things to do. This comes before `prefer`; within each
   * kind the preferred ones still come first, so every kind still shows its next new sticker.
   */
  varietyOf?: (request: T) => unknown;
}

export function createRepairQueue<T extends { id: string }>({
  requests,
  random,
  prefer = () => true,
  varietyOf = (request) => request.id,
}: RepairQueueOptions<T>): RepairQueue<T> {
  /** Keeps the requests that pass, unless none do. */
  const narrow = (pool: readonly T[], keep: (request: T) => boolean) => {
    const kept = pool.filter(keep);
    return kept.length > 0 ? kept : pool;
  };

  const pick = (waiting: readonly T[], excludedId?: string): T => {
    const candidates = requests.filter((request) => request.id !== excludedId && !waiting.includes(request));
    const waitingKinds = new Set(waiting.map(varietyOf));
    const pool = narrow(
      narrow(candidates, (request) => !waitingKinds.has(varietyOf(request))),
      prefer,
    );
    return pool[Math.floor(random() * pool.length)];
  };

  const fromWaiting = (waiting: readonly T[]): RepairQueue<T> => {
    const queue: RepairQueue<T> = {
      waiting,
      complete(id) {
        if (!waiting.some((request) => request.id === id)) return queue;
        const rest = waiting.filter((request) => request.id !== id);
        return fromWaiting([...rest, pick(rest, id)]);
      },
    };
    return queue;
  };

  const initial: T[] = [];
  while (initial.length < QUEUE_SIZE) initial.push(pick(initial));
  return fromWaiting(initial);
}
