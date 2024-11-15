import { useGlobalContext } from './global-provider.tsx';
import type { Layer } from './types/core.type.ts';
import { createEffect } from 'solid-js';
import { handleRectangleTool } from './handlers/rectangle-tool.handler.ts';

const Canvas = () => {
  const { state, addClick, layerFacade, setMousePosition } = useGlobalContext();

  const handleClick = (event: MouseEvent) => {
    const { offsetX, offsetY } = event;
    addClick(offsetX, offsetY);
  }

  const handleMouseMove = (event: MouseEvent) => {
    const { offsetX, offsetY } = event;
    setMousePosition(offsetX, offsetY);
  }

  const canvasEl = <canvas onClick={handleClick} onMouseMove={handleMouseMove} width={innerWidth} height={innerHeight}></canvas> as HTMLCanvasElement;
  const ctx = canvasEl.getContext('2d')!;

  const render = () => {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    state.layers.forEach((layer: Layer) => layer.draw(ctx));
    state.tempLayer?.draw(ctx);
    requestAnimationFrame(render);
  }

  render();

  createEffect(() => {
    handleRectangleTool(layerFacade, state.clicks, state.clicks.length ? state.mousePosition : undefined)
  })

  return canvasEl
}

export default Canvas;
