import { Point } from '../../../../types/Point.ts';
import { Vec2 } from '../../../../types/Vec2.ts';

/**
 * Calculates the rounded corners for a given shape defined by a set of points.
 * This function generates additional points to replace sharp corners with smooth arcs,
 * resulting in a shape with rounded corners.
 *
 * @param {Point[]} points - An array of Points representing the points of the basic shape.
 * @param {number} radius - Desired radius of the arches
 *
 * @returns {Object} An object containing:
 *   - `chunks`: a 2d array, where each sub-array contains three points `Point`:
 *     [start of arc, control point, end of arc], describing each rounded corner.
 *   - `radius`: The radius of the arcs used to round the corners.
 */
export const computePointsForRoundedShape = (points: Point[], radius: number)
  : [Point, Point, Point][] => {

  const unorderedPoints = points.reduce<Point[]>((allPoints, point, index, array) => {
    const nextPoint = index == array.length - 1 ? array[0] : array[index + 1];
    const dirVec = new Vec2(nextPoint.x - point.x, nextPoint.y - point.y);
    const normDirVec = dirVec.normalize();

    return [...allPoints, point,
      new Point(point.x + normDirVec.x * radius, point.y + normDirVec.y * radius),
      new Point(nextPoint.x - normDirVec.x * radius, nextPoint.y - normDirVec.y * radius)]
  }, []);

  const lastPoint = unorderedPoints.pop()!;
  const orderedPoints = [lastPoint, ...unorderedPoints];
  return orderedPoints.chunk<Point>(3) as [Point, Point, Point][];
}
