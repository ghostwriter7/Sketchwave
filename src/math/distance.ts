import type { Point } from '../render/primitives/Point.ts';

export const calculateDistance = ({ x: x1, y: y1 }: Point, { x: x2, y: y2 }: Point): number => {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}
