import type { Point } from '../types/Point.ts';
import type { RGBA } from '../types/core.type.ts';

export const getRGBFromPixel = (ctx: CanvasRenderingContext2D, { x, y }: Point): RGBA => {
  const [red, green, blue, alpha] = ctx.getImageData(x, y, 1, 1).data;
  return [red, green, blue, alpha];
}
