import type { CreatePathForShapeFn } from '../../../../types/core.type.ts';
import type { Point } from '../../../../types/Point.ts';
import { FULL_CIRCLE } from '../../../../constants.ts';

export const circle: CreatePathForShapeFn = (pointA: Point, _pointB: Point, dx: number, dy: number): Path2D => {
  const path = new Path2D();
  path.arc(pointA.x + dx / 2, pointA.y + dy / 2, Math.min(dx, dy) / 2, 0, FULL_CIRCLE);
  return path;
}
