export const createSimpleDotCursor: (color: string, lineWidth: number) => (ctx: OffscreenCanvasRenderingContext2D) => void =
  (color: string, lineWidth: number) => (ctx: OffscreenCanvasRenderingContext2D): void => {
    ctx.fillStyle = color;
    let x: number, y: number, radius: number;
    x = y = radius = lineWidth / 2;
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }
