import type { Coordinates } from "../types/core.type.ts";

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
