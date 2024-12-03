import type { Point } from '../../types/Point.ts';

export const renderCircles = (ctx: CanvasRenderingContext2D, points: Point[], radius: number, fromIndex = 1) => {
  if (points.length == 1) {
    const [{ x, y }] = points;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  } else {
    for (let i = fromIndex; i < points.length; i++) {
      const { x, y } = points[i];
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
