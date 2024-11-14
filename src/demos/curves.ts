const drawBlueDot = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.beginPath();
  ctx.fillStyle = 'blue';
  ctx.arc(x, y, 2.5, 0, 2 * Math.PI);
  ctx.fill();
}

const drawRedDot = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.beginPath();
  ctx.fillStyle = 'red';
  ctx.arc(x, y, 2.5, 0, 2 * Math.PI);
  ctx.fill();
}

const drawThinLine = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) => {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = 'green';
  ctx.stroke();
}

const drawQuadraticCurve = (ctx: CanvasRenderingContext2D, controlPoint: [number, number]) => {
  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.moveTo(150, 150);
  ctx.quadraticCurveTo(...controlPoint, 300, 200);
  ctx.stroke();
}

const drawBezierCurve = (ctx: CanvasRenderingContext2D, controlPointA: [number, number], controlPointB: [number, number]) => {
  ctx.beginPath();
  ctx.moveTo(150, 250);
  ctx.strokeStyle = 'black';
  ctx.bezierCurveTo(...controlPointA, ...controlPointB, 250, 275);
  ctx.stroke();
}

export const drawCurves = (ctx: CanvasRenderingContext2D) => {
  const controlPoint = [200, 130] as [number, number];
  drawQuadraticCurve(ctx, controlPoint);

  drawBlueDot(ctx, 150, 150);
  drawBlueDot(ctx, 300, 200);
  drawRedDot(ctx, ...controlPoint);
  drawThinLine(ctx, ...controlPoint, 150, 150);
  drawThinLine(ctx, ...controlPoint, 300, 200);

  const controlPointA = [130, 200] as [number, number];
  const controlPointB = [200, 200] as [number, number];

  drawBezierCurve(ctx, controlPointA, controlPointB);
  drawRedDot(ctx, controlPointA[0], controlPointA[1]);
  drawThinLine(ctx, controlPointA[0], controlPointA[1], 150, 250);
  drawRedDot(ctx, controlPointB[0], controlPointB[1]);
  drawThinLine(ctx, controlPointB[0], controlPointB[1], 250, 275);
  drawBlueDot(ctx, 150, 250);
  drawBlueDot(ctx, 250, 275);
}
