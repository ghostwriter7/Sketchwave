import type { Point } from '../../../../types/Point.ts';

/**
 * Creates a closed path `Path2D` following all the points in the list.
 * @param {Point[]} points a list of points describing the shape
 */
export const createPathFromPoints = (points: Point[]): Path2D => {
  const path = new Path2D();
  path.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach(({ x, y }) => path.lineTo(x, y));
  path.closePath();
  return path;
}
