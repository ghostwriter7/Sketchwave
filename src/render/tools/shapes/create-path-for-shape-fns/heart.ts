import type { CreatePathForShapeFn } from '../../../../types/core.type.ts';
import { Point } from '../../../../types/Point.ts';


export const heart: CreatePathForShapeFn = (origin: Point, endPoint: Point, dx: number, dy: number): Path2D => {
  const path = new Path2D();

  const halfWidthX = .5 * dx + origin.x;
  const centerY = dy * .45 + origin.y;

  const rightTopX = origin.x + .75 * dx;
  const rightX = origin.x + .95 * dx;
  const topY = centerY - .1 * dy;
  const bottomY = centerY + .1 * dy

  const leftTopX = origin.x + .25 * dx;
  const leftX = origin.x + .05 * dx;

  const bottomControlPointY =  endPoint.y - dy * .3;

  path.moveTo(halfWidthX, centerY - 0.1 * dy);
  path.quadraticCurveTo(rightTopX, origin.y, rightX, topY);
  path.quadraticCurveTo(endPoint.x, centerY, rightX, bottomY);
  path.quadraticCurveTo(endPoint.x - .1 * dx, bottomControlPointY, halfWidthX, endPoint.y);
  path.quadraticCurveTo(origin.x + .1 * dx, bottomControlPointY, leftX, bottomY);
  path.quadraticCurveTo(origin.x, centerY, leftX, topY)
  path.quadraticCurveTo(leftTopX, origin.y, halfWidthX, centerY - 0.1 * dy);

  path.closePath();

  return path;
}
