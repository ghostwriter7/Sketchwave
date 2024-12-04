import type { CreatePointsForShapeFn } from '../../../../types/core.type.ts';
import { Point } from '../../../../types/Point.ts';

export const bolt: CreatePointsForShapeFn = (pointA: Point, pointB: Point): Point[] => {
    const width = pointB.x - pointA.x;
    const height = pointB.y - pointA.y;

    return [
      new Point(.4 * width + pointA.x, pointA.y),
      new Point(.6 * width + pointA.x, .26 * height + pointA.y),
      new Point(.52 * width + pointA.x, .32 * height + pointA.y),
      new Point(.77 * width + pointA.x, .55 * height + pointA.y),
      new Point(.67 * width + pointA.x, .59 * height + pointA.y),
      pointB,
      new Point(.47 * width + pointA.x, .68 * height + pointA.y),
      new Point(.57 * width + pointA.x, .63 * height + pointA.y),
      new Point(.23 * width + pointA.x, .44 * height + pointA.y),
      new Point(.36 * width + pointA.x, .38 * height + pointA.y),
      new Point(pointA.x, .17 * height + pointA.y)
    ];
}
