import { Point } from '../../../../types/Point.ts';
import type { CreatePointsForShapeFn } from '../../../../types/core.type.ts';

export const rect: CreatePointsForShapeFn = ({ x: x1, y: y1 }: Point, { x: x2, y: y2 }: Point ): Point[] => [
    new Point(x1, y1),
    new Point(x2, y1),
    new Point(x2, y2),
    new Point(x1, y2),
  ];

