import type { ToolType } from '../../types/core.type.ts';
import type { ToolHandler } from './ToolHandler.ts';
import type { ToolState } from './ToolState.ts';
import type { LayerFacade } from '../LayerFacade.ts';
import { LineTool } from './LineTool.ts';
import { RectTool } from './RectTool.ts';

export class ToolHandlerFactory {
  private static readonly toolKeyToTypeMap: Record<ToolType, new (toolState: ToolState, layerFacade: LayerFacade) => ToolHandler> = {
    line: LineTool,
    rect: RectTool,
  }

  public static fromToolType(toolType: ToolType, toolState: ToolState, layerFacade: LayerFacade): ToolHandler {
    const type = this.toolKeyToTypeMap[toolType]

    if (!type) {
      throw new Error(`Unsupported tool type: ${toolType}`);
    }

    return new type(toolState, layerFacade);
  }
}
