import type { CreatePointsForShapeFn } from '../../../../types/core.type.ts';
import { Point } from '../../../../types/Point.ts';

export const bolt: CreatePointsForShapeFn = (pointA: Point, pointB: Point, dx: number, dy: number): Point[] => {
  const xFromOrigin = (percentage: number): number =>
    percentage * dx + pointA.x;

  const yFromOrigin = (percentage: number): number =>
    percentage * dy + pointA.y;

  return [
      new Point(xFromOrigin(.40), pointA.y),
      new Point(xFromOrigin(.60), yFromOrigin(.26)),
      new Point(xFromOrigin(.52), yFromOrigin(.32)),
      new Point(xFromOrigin(.77), yFromOrigin(.55)),
      new Point(xFromOrigin(.67), yFromOrigin(.59)),
      pointB,
      new Point(xFromOrigin(.47), yFromOrigin(.68)),
      new Point(xFromOrigin(.57), yFromOrigin(.63)),
      new Point(xFromOrigin(.23), yFromOrigin(.44)),
      new Point(xFromOrigin(.36), yFromOrigin(.38)),
      new Point(pointA.x, yFromOrigin(.17))
    ];
}
