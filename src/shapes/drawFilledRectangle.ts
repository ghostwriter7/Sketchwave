import { Coordinates, Dimensions } from "../types/core.type.ts";

export const drawFilledRectangle = (ctx: CanvasRenderingContext2D,
                                    { color, origin, dimensions }: {
                                      color: string,
                                      origin: Coordinates,
                                      dimensions: Dimensions
                                    }): void => {
  ctx.fillStyle = color;
  ctx.fillRect(...origin, ...dimensions);
}

export const drawStrokedRectangle = (ctx: CanvasRenderingContext2D, { color, origin, dimensions }: {
  color: string,
  origin: Coordinates,
  dimensions: Dimensions
}) => {
  ctx.strokeStyle = color;
  ctx.strokeRect(...origin, ...dimensions);
}

