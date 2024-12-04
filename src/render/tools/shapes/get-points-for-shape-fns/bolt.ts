import type { CreatePointsForShapeFn } from '../../../../types/core.type.ts';
import { Point } from '../../../../types/Point.ts';

export const bolt: CreatePointsForShapeFn = (pointA: Point, pointB: Point, dx: number, dy: number): Point[] => {
   return [
      new Point(.4 * dx + pointA.x, pointA.y),
      new Point(.6 * dx + pointA.x, .26 * dy + pointA.y),
      new Point(.52 * dx + pointA.x, .32 * dy + pointA.y),
      new Point(.77 * dx + pointA.x, .55 * dy + pointA.y),
      new Point(.67 * dx + pointA.x, .59 * dy + pointA.y),
      pointB,
      new Point(.47 * dx + pointA.x, .68 * dy + pointA.y),
      new Point(.57 * dx + pointA.x, .63 * dy + pointA.y),
      new Point(.23 * dx + pointA.x, .44 * dy + pointA.y),
      new Point(.36 * dx + pointA.x, .38 * dy + pointA.y),
      new Point(pointA.x, .17 * dy + pointA.y)
    ];
}
