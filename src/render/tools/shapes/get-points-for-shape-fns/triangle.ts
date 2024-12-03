import { Point } from '../../../../types/Point.ts';

export const triangle = (pointA: Point, pointB: Point): [Point, Point, Point] =>
  [Point.horizontalMidPoint(pointA, pointB), pointB, new Point(pointA.x, pointB.y)];

