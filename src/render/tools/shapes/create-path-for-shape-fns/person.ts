import type { CreatePathForShapeFn } from '../../../../types/core.type.ts';
import type { Point } from '../../../../types/Point.ts';

export const person: CreatePathForShapeFn = (origin: Point, endPoint: Point, dx: number, dy: number): Path2D => {
  const path = new Path2D();

  const headRadius = dy * .2;
  const centerX = origin.x + dx / 2;
  const [headX, headY] = [centerX, origin.y + dy * .25] as const;

  path.moveTo(headX + headRadius, headY);
  path.arc(headX, headY, dy * .2, 0, 2 * Math.PI);

  const bodyTopY = endPoint.y - dy * .30;

  path.moveTo(origin.x, endPoint.y);
  path.lineTo(endPoint.x, endPoint.y);
  path.lineTo(endPoint.x, bodyTopY);
  path.quadraticCurveTo(centerX, endPoint.y - .6 * dy, origin.x, bodyTopY);
  path.closePath();

  return path;
}
