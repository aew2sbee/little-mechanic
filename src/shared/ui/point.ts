export interface Point {
  x: number;
  y: number;
}

/** The fixed coordinate space every screen is laid out in; `app` scales it to fit the device. */
export const STAGE_SIZE = { width: 1280, height: 800 } as const;

/**
 * Converts a pointer position to an element's own coordinates, given the element's on-screen
 * `rect`. The element may be scaled by CSS, so the rect's width is compared with `logicalWidth`.
 * Measure the rect once when a drag starts: reading it on every move forces layout.
 */
export function localPoint(
  pointer: { clientX: number; clientY: number },
  rect: Pick<DOMRectReadOnly, 'left' | 'top' | 'width'>,
  logicalWidth: number,
): Point {
  const scale = rect.width / logicalWidth || 1;
  return { x: (pointer.clientX - rect.left) / scale, y: (pointer.clientY - rect.top) / scale };
}
