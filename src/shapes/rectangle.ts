import type { Point } from '../render/primitives/Point.ts';

export const createRectPathFromPoints = (pointA: Point, pointB: Point): Path2D => {
  const { x: x1, y: y1 } = pointA;
  const { x: x2, y: y2 } = pointB;

  const width = Math.abs(x1 - x2)
  const height = Math.abs(y1 - y2);
  const x = Math.min(x1, x2);
  const y = Math.min(y1, y2);

  const path = new Path2D();
  path.rect(x, y, width, height);
  return path;
}
