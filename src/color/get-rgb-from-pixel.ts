import type { Point } from '../render/primitives/Point.ts';

export const getRGBFromPixel = (ctx: CanvasRenderingContext2D, { x, y }: Point): [number, number, number] => {
  const pixel = ctx.getImageData(x, y, 1, 1);
  const [red, green, blue] = pixel.data;
  return [red, green, blue];
}
