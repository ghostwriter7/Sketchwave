import { ToolHandler } from '../abstract/ToolHandler.ts';
import type { ToolState } from '../models/ToolState.ts';
import { type LayerFacade } from '../../LayerFacade.ts';

export class AirbrushTool extends ToolHandler {

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade);
  }

  public tryCreateLayer(): void {
  }

  protected initializeListeners(): void {

  }

  protected override async getCustomCursor(): Promise<string> {
    const offscreenCanvas = new OffscreenCanvas(this.size + 2, this.size + 2);
    const ctx = offscreenCanvas.getContext('2d')!;

    ctx.strokeStyle = this.colour;
    ctx.arc(this.halfSize + 1, this.halfSize + 1, this.halfSize, 0, 2 * Math.PI);
    ctx.stroke();

    const blob = await offscreenCanvas.convertToBlob();
    this.cursorObjectUrl = URL.createObjectURL(blob);
    return `url('${this.cursorObjectUrl}') ${this.halfSize} ${this.halfSize}, auto`;
  }

}
