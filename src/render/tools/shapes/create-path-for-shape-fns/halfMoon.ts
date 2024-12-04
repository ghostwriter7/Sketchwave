import type { CreatePathForShapeFn } from '../../../../types/core.type.ts';
import type { Point } from '../../../../types/Point.ts';

export const halfMoon: CreatePathForShapeFn = (origin: Point, endPoint: Point, dx: number, dy: number): Path2D => {
  const path = new Path2D();

  const topX = origin.x + dx * .4;
  const topY = origin.y;

  path.moveTo(topX, topY);
  path.quadraticCurveTo(origin.x + 0.4 * dx, origin.y + .65 * dy, endPoint.x, endPoint.y - .2 * dy);
  path.bezierCurveTo(endPoint.x - .5 * dx, endPoint.y + .3 * dy, origin.x - .2 * dx, origin.y + .2 * dy, topX, topY);

  return path;
}
