const Canvas = () => {
  const canvasEl = <canvas></canvas> as HTMLCanvasElement;
  canvasEl.width = innerWidth;
  canvasEl.height = innerHeight;
  return canvasEl
}

export default Canvas;
