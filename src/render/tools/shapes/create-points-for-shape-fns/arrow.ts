import type { CreatePointsForShapeFn } from '../../../../types/core.type.ts';
import { Point } from '../../../../types/Point.ts';

export const arrow: CreatePointsForShapeFn = (origin: Point, endPoint: Point, dx: number, dy: number): Point[] => {
  const halfWidthX = dx * .5 + origin.x;
  const topEdgeY = .28 * dy + origin.y;
  const bottomEdgeY = .72 * dy + origin.y;
  return [
    new Point(origin.x, dy * .5 + origin.y),
    new Point(halfWidthX, origin.y),
    new Point(halfWidthX, topEdgeY),
    new Point(endPoint.x, topEdgeY),
    new Point(endPoint.x, bottomEdgeY),
    new Point(halfWidthX, bottomEdgeY),
    new Point(halfWidthX, endPoint.y),
  ];
}
