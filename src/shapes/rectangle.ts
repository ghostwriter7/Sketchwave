import { Coordinates, Dimensions } from '../types/core.type.ts';
import type { Point } from '../render/primitives/Point.ts';

export const createRectPathFromPoints = (pointA: Point, pointB: Point): Path2D => {
  const { x: x1, y: y1 } = pointA;
  const { x: x2, y: y2 } = pointB;

  const width = Math.abs(x1 - x2)
  const height = Math.abs(y1 - y2);
  const x = Math.min(x1, x2);
  const y = Math.min(y1, y2);

  const path = new Path2D();
  path.rect(x, y, width, height);
  return path;
}

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

export const drawRoundedRectangle = (ctx: CanvasRenderingContext2D, { color, origin, dimensions }: {
  color: string,
  origin: Coordinates,
  dimensions: Dimensions
}) => {
  ctx.fillStyle = color;
  ctx.roundRect(...origin, ...dimensions, 5);
  ctx.fill();
}

export const clearRect = (ctx: CanvasRenderingContext2D, { origin, dimensions }: {
  origin: Coordinates,
  dimensions: Dimensions
}) => ctx.clearRect(...origin, ...dimensions)

export const drawImageFrame = (ctx: CanvasRenderingContext2D, { color, origin, dimensions }: {
  color: string,
  origin: Coordinates,
  dimensions: Dimensions
}): void => {
  drawFilledRectangle(ctx, { color, origin, dimensions });
  const shorterEdge = Math.min(...dimensions);
  const frameWidth = 0.1 * shorterEdge;
  const innerDimensions = dimensions.map((dimension) => dimension - 2 * frameWidth) as Dimensions;
  const innerOrigin = origin.map((coordinate) => coordinate + frameWidth) as Coordinates;
  clearRect(ctx, { origin: innerOrigin, dimensions: innerDimensions });

  drawStrokedRectangle(ctx, {
    color,
    origin: innerOrigin.map((coordinate) => coordinate + 5) as Coordinates,
    dimensions: innerDimensions.map((dimension) => dimension - 10) as Dimensions
  })
}
