import { Point } from '../../../../types/Point.ts';
import type { CreatePointsForShapeFn } from '../../../../types/core.type.ts';

export const triangle: CreatePointsForShapeFn = (pointA: Point, pointB: Point): [Point, Point, Point] =>
  [Point.horizontalMidPoint(pointA, pointB), pointB, new Point(pointA.x, pointB.y)];

