import { useGlobalContext } from '../../global-provider.tsx';
import { createEffect, onMount } from 'solid-js';
import { ToolState } from '../../render/tools/ToolState.ts';
import { LayerFacade } from '../../render/LayerFacade.ts';
import type { ToolHandler } from '../../render/tools/ToolHandler.ts';
import { ToolHandlerFactory } from '../../render/tools/ToolHandlerFactory.ts';
import './canvas.css';

const Canvas = () => {
  const { state } = useGlobalContext();
  let canvasRef: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let layerFacade : LayerFacade;

  onMount(() => {
    ctx = canvasRef.getContext('2d', { willReadFrequently: true })!;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvasRef.width, canvasRef.height);
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

  return <canvas class="canvas" ref={canvasRef!} height={state.height} width={state.width}></canvas>
}

export default Canvas;
