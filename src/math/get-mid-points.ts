import { Point } from '../render/primitives/Point.ts';
import { calculateDistance } from './distance.ts';

export const getMidPoints = (pointA: Point, pointB: Point): Point[] => {
  const magnitude = calculateDistance(pointA, pointB);

  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;

  const normalizedVec = [dx / magnitude, dy / magnitude];
  const count = Math.floor(magnitude);

  return Array.from({ length: count }, (_, i) =>
    new Point(pointA.x + normalizedVec[0] * (i + 1), pointA.y + normalizedVec[1] * (i + 1))
  )
}
