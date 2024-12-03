import { Point } from '../types/Point.ts';
import { FULL_CIRCLE } from '../constants.ts';

export const createRandomPoints = ({ x, y }: Point, radius: number, count: number): Point[] => {
  const points = new Array(count);
  for (let i = 0; i < count; i++) {
    const randomRadius = Math.sqrt(Math.random()) * radius;
    const randomAngle = Math.random() * FULL_CIRCLE;
    const randomX = x + randomRadius * Math.cos(randomAngle);
    const randomY = y + randomRadius * Math.sin(randomAngle);
    points.push(new Point(randomX, randomY));
  }
  return points;
}
