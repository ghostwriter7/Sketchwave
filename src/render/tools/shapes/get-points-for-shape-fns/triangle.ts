import { Point } from '../../../primitives/Point.ts';

export const triangle = ({ x: x1, y: y1 }: Point, { x: x2, y: y2 }: Point): [Point, Point, Point] => {
  const middlePoint = new Point((x2 - x1) / 2 + x1, y1);
  return [middlePoint, new Point(x2, y2), new Point(x1, y2)]
}
