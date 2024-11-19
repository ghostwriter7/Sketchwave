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

  let activeTool: ToolHandler | null = null;

  onMount(() => {
    ctx = new Proxy(canvasRef.getContext('2d', { willReadFrequently: true })!, {
      get(target: CanvasRenderingContext2D, property: string, receiver: any): any {
        logger.debug(`Retrieving "${property}" from the main ctx.`);
        const value = target[property];
        if (value instanceof Function) {
          return (...args: unknown[])=> value.apply(target, args);
        }
        return value;
      },
      set(target: CanvasRenderingContext2D, property: string, newValue: any): boolean {
        logger.debug(`Setting "${property}" to "${newValue}" on the main ctx.`);
        target[property] = newValue;
        return true;
      }
    })
    clearCanvas();
    layerFacade = new LayerFacade(ctx);

    document.body.addEventListener('contextmenu', (event: MouseEvent) => {
      event.preventDefault();
      activeTool?.cancel();
    });
  });


  createEffect(() => {
    const width = state.width;
    const height = state.height;
    if (canvasRef.width !== width || canvasRef.height !== height) {
      logger.log(`Notified about dimensions change (W: ${canvasRef.width} -> ${width}, H: ${canvasRef.height} -> ${height}).`);
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
    onMouseMove={(event) => setMousePos(event.offsetX, event.offsetY)}>
  </canvas>
}

export default Canvas;
