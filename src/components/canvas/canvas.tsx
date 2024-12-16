import { useGlobalContext } from '../../global-provider.tsx';
import { createEffect, onMount } from 'solid-js';
import { ToolStateFactory } from '../../render/tools/models/ToolState.ts';
import { LayerFacade } from '../../render/LayerFacade.ts';
import type { ToolHandler } from '../../render/tools/abstract/ToolHandler.ts';
import { ToolHandlerFactory } from '../../render/tools/ToolHandlerFactory.ts';
import './canvas.css';
import { Logger } from '../../utils/Logger.ts';
import { ScaleChangeEvent } from '../../types/events.ts';

const Canvas = () => {
  const { state, setCtx, setLayerFacade, setMousePos } = useGlobalContext();

  const canvasRef = <canvas
    class="canvas"
    height={state.height}
    style={{ transform: `scale(${state.scale})`}}
    width={state.width}
    onMouseLeave={() => setMousePos(null, null)}
    onMouseMove={(event) => setMousePos(event.offsetX, event.offsetY)}>
  </canvas> as HTMLCanvasElement;

  const ctx = canvasRef.getContext('2d', { willReadFrequently: true })!

  window.ctx = ctx;

  setCtx(ctx);
  const layerFacade = new LayerFacade(state);
  setLayerFacade(layerFacade)

  const logger = new Logger('Canvas')

  let activeTool: ToolHandler | null = null;

  onMount(() => {
    layerFacade.renderLayers();

    document.body.addEventListener('contextmenu', (event: MouseEvent) => {
      event.preventDefault();
      activeTool?.onDestroy();
      activeTool = null;

      if (state.activeTool) {
        layerFacade.renderLayers();
        const toolState = ToolStateFactory.fromState(state);
        activeTool = ToolHandlerFactory.fromToolType(state.activeTool, toolState, layerFacade);
        activeTool.onInit();
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
    activeTool?.onDestroy();
    activeTool = null;

    if (state.activeTool) {
      const toolState = ToolStateFactory.fromState(state);
      activeTool = ToolHandlerFactory.fromToolType(state.activeTool, toolState, layerFacade);
      activeTool.onInit();
    }
  });

  createEffect((previous: number): number => {
    if (previous == -1) return state.scale;

    const scale = state.scale;
    canvasRef.dispatchEvent(new ScaleChangeEvent(scale));
    return scale;
  }, -1);

  return <>
    {canvasRef}
  </>
}

export default Canvas;
