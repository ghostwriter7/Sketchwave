import type { Point } from '../../../../types/Point.ts';
import { computePointsForRoundedShape } from './compute-points-for-rounded-shape.ts';

/**
 * Given a list of Points describing a shape, it calculates a rounded variation of the shape
 * and creates a reusable path needed for filling / stroking the shape.
 *
 * @param {Point[]} points List of points describing the shape
 * @param {number} radius Desired radius of the arches
 */
export const createRoundedPath = (points: Point[], radius: number): Path2D => {
  const chunks = computePointsForRoundedShape(points, radius);

  const path = new Path2D();

  for (let i = 0; i < chunks.length; i++) {
    const [startPoint, testPoint, endPoint] = chunks[i];

    if (i == 0) {
      path.moveTo(startPoint.x, startPoint.y);
    } else {
      path.lineTo(startPoint.x, startPoint.y)
    }

    path.arcTo(testPoint.x, testPoint.y, endPoint.x, endPoint.y, radius);
  }

  path.closePath();

  return path;
}
