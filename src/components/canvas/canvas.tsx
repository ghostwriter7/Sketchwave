import { useGlobalContext } from '../../global-provider.tsx';
import { createEffect, onMount } from 'solid-js';
import { ToolState } from '../../render/tools/ToolState.ts';
import { LayerFacade } from '../../render/LayerFacade.ts';
import type { ToolHandler } from '../../render/tools/ToolHandler.ts';
import { ToolHandlerFactory } from '../../render/tools/ToolHandlerFactory.ts';
import './canvas.css';
import { Logger } from '../../utils/Logger.ts';

const Canvas = () => {
  const { state, setMousePos } = useGlobalContext();
  let canvasRef: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let layerFacade: LayerFacade;
  const logger = new Logger('CANVAS')

  const clearCanvas = () => {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvasRef.width, canvasRef.height);
  }

  onMount(() => {
    ctx = canvasRef.getContext('2d', { willReadFrequently: true })!;
    clearCanvas();
    layerFacade = new LayerFacade(ctx);
  });

  let activeTool: ToolHandler | null = null;

  createEffect(() => {
    const width = state.width;
    const height = state.height;
    if (canvasRef.width !== width || canvasRef.height !== height) {
      logger.log('Notified about dimensions change -> updating.');
      clearCanvas();
      layerFacade.renderLayers();
    }
  });

  createEffect(() => {
    const toolState = ToolState.fromState(state);

    activeTool?.onDestroy();

    if (state.activeTool) {
      activeTool = ToolHandlerFactory.fromToolType(state.activeTool, ctx, toolState, layerFacade);
    }
  })

  return <canvas
    class="canvas"
    ref={canvasRef!}
    height={state.height}
    width={state.width}
    onMouseLeave={() => setMousePos(null, null)}
    onMouseMove={(event) => setMousePos(event.offsetX, event.offsetY) }>
  </canvas>
}

export default Canvas;
