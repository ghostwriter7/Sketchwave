import type { Coordinates } from '../types/core.type.ts';
import { calculateDistance } from '../math/distance.ts';

const drawTriangle = (ctx: CanvasRenderingContext2D, points: [Coordinates, Coordinates, Coordinates]) => {
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  ctx.lineTo(...points[1]);
  ctx.lineTo(...points[2]);
}

export const drawFilledTriangle = (ctx: CanvasRenderingContext2D,
                                   { color, points }: {
                                     color: string, points: [Coordinates, Coordinates, Coordinates]
                                   }) => {
  ctx.fillStyle = color;
  drawTriangle(ctx, points);
  ctx.fill();
}

export const drawStrokedTriangle = (ctx: CanvasRenderingContext2D,
                                    { color, points }: {
                                      color: string,
                                      points: [Coordinates, Coordinates, Coordinates]
                                    }) => {
  ctx.strokeStyle = color;
  drawTriangle(ctx, points);
  ctx.closePath();
  ctx.stroke();
}

export const drawFilledCircle = (ctx: CanvasRenderingContext2D, { color, points: [centerPoint, outerPoint] }: {
  color: string,
  points: [Coordinates, Coordinates]
}) => {
  ctx.fillStyle = color;
  const radius = calculateDistance(centerPoint, outerPoint);
  ctx.beginPath();
  ctx.arc(...centerPoint, radius, 0, 2 * Math.PI);
  ctx.fill();
}
