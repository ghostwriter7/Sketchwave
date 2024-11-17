import type { ToolType } from '../../types/core.type.ts';
import type { ToolHandler } from './ToolHandler.ts';
import type { ToolState } from './ToolState.ts';
import type { LayerFacade } from '../LayerFacade.ts';
import { LineTool } from './LineTool.ts';
import { RectTool } from './RectTool.ts';

export class ToolHandlerFactory {
  public static fromToolType(toolType: ToolType, ctx: CanvasRenderingContext2D, toolState: ToolState, layerFacade: LayerFacade): ToolHandler {
    switch (toolType) {
      case 'line':
        return new LineTool(ctx, toolState, layerFacade);
      case 'rect':
        return new RectTool(ctx, toolState, layerFacade);
      default:
        throw new Error(`Unsupported tool type: ${toolType}`);
    }
  }
}
