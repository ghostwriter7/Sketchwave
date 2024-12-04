import type { CreatePointsForShapeFn } from '../../../../types/core.type.ts';
import { Point } from '../../../../types/Point.ts';

export const diamond: CreatePointsForShapeFn = (pointA: Point, pointB: Point, dx: number, dy: number): Point[] => {
  const topEdgeMargin = .2 * dx;

  const topLeftX = pointA.x + topEdgeMargin;
  const topRightX = pointB.x - topEdgeMargin;
  const outerY = pointA.y + .25 * dy;
  const centerX = pointA.x + dx / 2;

  return [
    new Point(topLeftX, pointA.y),
    new Point(topRightX, pointA.y),
    new Point(pointB.x, outerY),
    new Point(centerX, pointB.y),
    new Point(pointA.x, outerY)
  ];
}
