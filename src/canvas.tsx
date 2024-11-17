import { useGlobalContext } from './global-provider.tsx';
import { createEffect, onMount } from 'solid-js';
import { LineTool } from './render/tools/LineTool.ts';
import { ToolState } from './render/tools/ToolState.ts';
import { LayerFacade } from './render/LayerFacade.ts';
import type { ToolHandler } from './render/tools/ToolHandler.ts';

const Canvas = () => {
  const { state } = useGlobalContext();
  let canvasRef: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  const layerFacade = new LayerFacade();

  onMount(() => {
    ctx = canvasRef.getContext('2d', { willReadFrequently: true })!;
  })

  let activeTool: ToolHandler | null = null;

  createEffect(() => {
    const [red, green, blue] = state.color;
    const toolState = new ToolState(`rgb(${red},${green},${blue})`);

    activeTool?.onDestroy();

    activeTool = new LineTool(ctx, toolState, layerFacade);
    activeTool.onInit();
  })

  return <canvas ref={canvasRef} height={innerHeight} width={innerWidth}></canvas>
}

export default Canvas;
