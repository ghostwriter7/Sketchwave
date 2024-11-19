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
  const logger = new Logger('Canvas')

  let activeTool: ToolHandler | null = null;

  onMount(() => {
    ctx = new Proxy(canvasRef.getContext('2d', { willReadFrequently: true })!, {
      get(target: CanvasRenderingContext2D, property: string): any {
        logger.debug(`Retrieving "${property}" from the main ctx.`);
        const value = target[property];
        if (value instanceof Function) {
          return (...args: unknown[]) => value.apply(target, args);
        }
        return value;
      },
      set(target: CanvasRenderingContext2D, property: string, newValue: any): boolean {
        logger.debug(`Setting "${property}" to "${newValue}" on the main ctx.`);
        target[property] = newValue;
        return true;
      }
    })
    layerFacade = new LayerFacade(ctx);
    layerFacade.renderLayers();

    document.body.addEventListener('contextmenu', (event: MouseEvent) => {
      event.preventDefault();
      activeTool?.onDestroy();
      if (state.activeTool) {
        layerFacade.renderLayers();
        const toolState = ToolState.fromState(state);
        activeTool = ToolHandlerFactory.fromToolType(state.activeTool, ctx, toolState, layerFacade);
      }
    });
  });


  createEffect((prev: [number, number] | undefined) => {
    const width = state.width;
    const height = state.height;
    if (!!prev && (prev[0] !== width || prev[1] !== height)) {
      logger.log(`Notified about dimensions change (W: ${prev[0]} -> ${width}, H: ${prev[1]} -> ${height}).`);
      layerFacade.refreshSnapshot();
      layerFacade.renderLayers();
    }
    return [width, height] as [number, number];
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
