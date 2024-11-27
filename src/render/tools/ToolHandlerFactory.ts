import type { ToolType } from '../../types/core.type.ts';
import type { ToolHandler } from './abstract/ToolHandler.ts';
import type { ToolState } from './models/ToolState.ts';
import type { LayerFacade } from '../LayerFacade.ts';
import { LineTool } from './LineTool.ts';
import { RectTool } from './RectTool.ts';
import { EraserTool } from './EraserTool.ts';
import { BrushTool } from './brushes/BrushTool.ts';
import { AirbrushTool } from './brushes/airbrush/AirbrushTool.ts';
import { CalligraphyBrushTool } from './brushes/caligraphy-brush/CalligraphyBrushTool.ts';

export class ToolHandlerFactory {
  private static readonly toolKeyToTypeMap: Record<ToolType, new (toolState: ToolState, layerFacade: LayerFacade) => ToolHandler> = {
    airbrush: AirbrushTool,
    brush: BrushTool,
    calligraphyBrush: CalligraphyBrushTool,
    eraser: EraserTool,
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
