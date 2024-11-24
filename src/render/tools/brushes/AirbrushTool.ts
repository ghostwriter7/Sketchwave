import type { ToolState } from '../models/ToolState.ts';
import { type LayerFacade } from '../../LayerFacade.ts';
import { SimpleTool } from '../abstract/SimpleTool.ts';

export class AirbrushTool extends SimpleTool {
  protected override cursorSize = this.size + 2;
  protected override customCursorCreateFn = (ctx: OffscreenCanvasRenderingContext2D) => {
    ctx.strokeStyle = this.colour;
    ctx.arc(this.halfSize + 1, this.halfSize + 1, this.halfSize, 0, 2 * Math.PI);
    ctx.stroke();
  };

  constructor(toolState: ToolState, layerFacade: LayerFacade) {
    super(toolState, layerFacade);
  }

  public tryCreateLayer(): void {
  }

  protected initializeListeners(): void {

  }
}
