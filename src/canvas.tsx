import { useGlobalContext } from './global-provider.tsx';
import { createEffect, onMount } from 'solid-js';
import { ToolState } from './render/tools/ToolState.ts';
import { LayerFacade } from './render/LayerFacade.ts';
import type { ToolHandler } from './render/tools/ToolHandler.ts';
import { ToolHandlerFactory } from './render/tools/ToolHandlerFactory.ts';

const Canvas = () => {
  const { state } = useGlobalContext();
  let canvasRef: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let layerFacade : LayerFacade;

  onMount(() => {
    ctx = canvasRef.getContext('2d', { willReadFrequently: true })!;
    layerFacade = new LayerFacade(ctx);
  });

  let activeTool: ToolHandler | null = null;

  createEffect(() => {
    const toolState = ToolState.fromState(state);

    activeTool?.onDestroy();

    if (state.activeTool) {
      activeTool = ToolHandlerFactory.fromToolType(state.activeTool, ctx, toolState, layerFacade);
    }
  })

  return <canvas ref={canvasRef!} height={innerHeight} width={innerWidth}></canvas>
}

export default Canvas;
