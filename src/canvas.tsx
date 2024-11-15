import { useGlobalContext } from './global-provider.tsx';
import type { Layer } from './types/core.type.ts';

const Canvas = () => {
  const { state } = useGlobalContext();

  const handleClick = (event: MouseEvent) => {
    const { offsetX, offsetY } = event;
    console.log('Click at ', offsetX, offsetY);
  }

  const handleMouseMove = (event: MouseEvent) => {
    const { offsetX, offsetY } = event;
    console.log('Mouse move at ', offsetX, offsetY);
  }

  const canvasEl = <canvas onClick={handleClick} onMouseMove={handleMouseMove} width={innerWidth} height={innerHeight}></canvas> as HTMLCanvasElement;

  const ctx = canvasEl.getContext('2d') as CanvasRenderingContext2D;

  const render = () => {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    state.layers.forEach((layer: Layer) => layer.draw(ctx));
    requestAnimationFrame(render);
  }

  render();

  return canvasEl;
}

export default Canvas;
