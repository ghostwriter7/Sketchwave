export const Playground = () => {
  const canvas = <canvas></canvas> as HTMLCanvasElement;

  const gl = canvas.getContext('webgl')!;

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  return canvas;
}
