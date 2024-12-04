import type { CreatePointsForShapeFn } from '../../../../types/core.type.ts';
import { Point } from '../../../../types/Point.ts';

export const checkmark: CreatePointsForShapeFn = (origin: Point, endPoint: Point, dx: number, dy: number): Point[] => [
  new Point(origin.x, .53 * dy + origin.y),
  new Point(.12 * dx + origin.x, .31 * dy + origin.y),
  new Point(.42 * dx + origin.x, .60 * dy + origin.y),
  new Point(.79 * dx + origin.x, origin.y),
  new Point(endPoint.x, .18 * dy + origin.y),
  new Point(.47 * dx + origin.x, endPoint.y),
]
