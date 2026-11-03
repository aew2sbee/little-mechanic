export interface Point {
  x: number;
  y: number;
}

/** The fixed coordinate space every screen is laid out in; `app` scales it to fit the device. */
export const STAGE_SIZE = { width: 1280, height: 800 } as const;

/**
 * Converts a pointer position to an element's own coordinates. The element may be scaled by
 * CSS, so its on-screen width is compared with `logicalWidth`.
 */
export function localPoint(
  pointer: { clientX: number; clientY: number },
  element: Pick<Element, 'getBoundingClientRect'>,
  logicalWidth: number,
): Point {
  const rect = element.getBoundingClientRect();
  const scale = rect.width / logicalWidth || 1;
  return { x: (pointer.clientX - rect.left) / scale, y: (pointer.clientY - rect.top) / scale };
}
