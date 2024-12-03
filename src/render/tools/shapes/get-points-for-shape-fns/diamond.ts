import type { CreatePointsForShapeFn } from '../../../../types/core.type.ts';
import { Point } from '../../../../types/Point.ts';

export const diamond: CreatePointsForShapeFn = (pointA: Point, pointB: Point): Point[] => {
  const width = pointB.x - pointA.x;
  const height = pointB.y - pointA.y;
  const topEdgeMargin = .2 * width;

  const topLeftX = pointA.x + topEdgeMargin;
  const topRightX = pointB.x - topEdgeMargin;
  const outerY = pointA.y + .25 * height;
  const centerX = pointA.x + width / 2;

  return [
    new Point(topLeftX, pointA.y),
    new Point(topRightX, pointA.y),
    new Point(pointB.x, outerY),
    new Point(centerX, pointB.y),
    new Point(pointA.x, outerY)
  ];
}
