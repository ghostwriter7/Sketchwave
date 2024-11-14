import type { Coordinates } from "../types/core.type.ts";
import { calculateDistance } from '../math/distance.ts';

export const drawFilledTriangle = (ctx: CanvasRenderingContext2D,
                                   { color, points: [firstPoint, secondPoint, thirdPoint] }: {
                                     color: string,
                                     points: [Coordinates, Coordinates, Coordinates]
                                   }) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(...firstPoint);
  ctx.lineTo(...secondPoint);
  ctx.lineTo(...thirdPoint);
  ctx.fill();
}

export const drawFilledCircle = (ctx: CanvasRenderingContext2D, { color, points: [centerPoint, outerPoint]}: { color: string, points: [Coordinates, Coordinates] } = {}) => {
  ctx.fillStyle = color;
  const radius = calculateDistance(centerPoint, outerPoint);
  ctx.beginPath();
  ctx.arc(...centerPoint, radius, 0, 2 * Math.PI);
  ctx.fill();
}
