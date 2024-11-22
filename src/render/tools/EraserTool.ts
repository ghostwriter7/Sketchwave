import { ToolHandler } from './ToolHandler.ts';
import type { ToolState } from './ToolState.ts';
import type { LayerFacade } from '../LayerFacade.ts';

export class EraserTool extends ToolHandler {
  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade);
  }

  public tryCreateLayer(): void {
    // throw new Error('Method not implemented.');
  }

  protected initializeListeners(): void {
    // throw new Error('Method not implemented.');
  }

  protected async getCustomCursor(): Promise<string> {
    const canvas = new OffscreenCanvas(12, 12);
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    const blob = await ctx.canvas.convertToBlob();
    const objectUrl = URL.createObjectURL(blob);
    return `url('${objectUrl}'), auto`;
  }
}
