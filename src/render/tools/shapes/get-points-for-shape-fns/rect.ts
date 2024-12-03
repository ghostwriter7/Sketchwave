import { Point } from '../../../../types/Point.ts';

export const rect = ({ x: x1, y: y1 }: Point, { x: x2, y: y2 }: Point ): Point[] => {
  return [
    new Point(x1, y1),
    new Point(x2, y1),
    new Point(x2, y2),
    new Point(x1, y2),
  ];
}
