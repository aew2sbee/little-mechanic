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
}

export function createRepairQueue<T extends { id: string }>({
  requests,
  random,
  prefer = () => true,
}: RepairQueueOptions<T>): RepairQueue<T> {
  const pick = (waiting: readonly T[], excludedId?: string): T => {
    const candidates = requests.filter((request) => request.id !== excludedId && !waiting.includes(request));
    const preferred = candidates.filter(prefer);
    const pool = preferred.length > 0 ? preferred : candidates;
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
