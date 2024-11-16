import { useGlobalContext } from './global-provider.tsx';
import type { Layer } from './types/core.type.ts';
import { createEffect } from 'solid-js';
import { handleRectangleTool } from './handlers/handle-rectangle-tool.ts';
import { handleSelectTool } from './handlers/handle-select.ts';
import type { Tool, ToolHandler } from './handlers/tool-handler.type.ts';

const Canvas = () => {
  const { state, addClick, layerFacade, setMousePosition } = useGlobalContext();

  const toolHandlers: Record<Tool, ToolHandler> = {
    rectFill: handleRectangleTool,
    select: handleSelectTool,
  };

  const handleClick = (event: MouseEvent) => {
    const { offsetX, offsetY } = event;
    addClick(offsetX, offsetY);
  }

  const handleMouseMove = (event: MouseEvent) => {
    const { offsetX, offsetY } = event;
    setMousePosition(offsetX, offsetY);
  }

  const canvasEl = <canvas onClick={handleClick} onMouseMove={handleMouseMove} width={innerWidth}
                           height={innerHeight}></canvas> as HTMLCanvasElement;
  const ctx = canvasEl.getContext('2d')!;

  const render = (delta: number) => {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    state.layers.forEach((layer: Layer) => layer.draw(ctx, delta));
    state.tempLayer?.draw(ctx);
    requestAnimationFrame(render);
  }

  render(0);

  createEffect(() => {
    const handler = state.activeTool ? toolHandlers[state.activeTool] : null;

    if (handler) {
      const [red, green, blue] = state.color;
      ctx.fillStyle = `rgb(${red},${green},${blue})`;
      handler(layerFacade, state.clicks, state.clicks.length ? state.mousePosition : undefined)
    }
  })

  return canvasEl
}

export default Canvas;
