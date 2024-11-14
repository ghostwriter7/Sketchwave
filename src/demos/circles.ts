import { toRadians } from '../math/to-radians.ts';

export const drawCircles = (ctx: CanvasRenderingContext2D) => {
  for (let row = 0; row < 4; row++) {
    for (let column = 0; column < 5; column++) {
      const radius = 35;
      const x = 80 + column * 80;
      const y = 80 + row * 80;
      const startAngle = toRadians(row * column);
      const endAngle = toRadians((row + 1) * (column + 1) * 20);
      const clockwise = column % 2 === 0;

      ctx.beginPath();
      ctx.arc(x, y, radius, startAngle, endAngle, clockwise);

      if (row >= 2) {
        ctx.stroke();
      } else {
        ctx.fill();
      }
    }
  }
}
