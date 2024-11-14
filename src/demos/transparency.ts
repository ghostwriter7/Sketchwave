export const drawTransparencyDemo = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = 'rgb(200, 50, 50)';
  ctx.fillRect(0, 0, 100, 100);

  ctx.fillStyle = 'rgb(50, 200, 50)';
  ctx.fillRect(100, 0, 100, 100);

  ctx.fillStyle = 'rgb(50, 50, 200)';
  ctx.fillRect(0, 100, 100, 100);

  ctx.fillStyle = 'rgb(200, 200, 50)';
  ctx.fillRect(100, 100, 100, 100);

  ctx.globalAlpha = 0.2;

  for (let i = 1; i < 10; i++) {
    ctx.fillStyle = 'white';
    ctx.arc(100, 100, 10 * i, 0, 2 * Math.PI);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}
